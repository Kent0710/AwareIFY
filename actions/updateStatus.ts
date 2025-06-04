"use server";

import { createClient } from "@/lib/db/supabase/server";
import { UpdateStatusType } from "@/object-types";
import { revalidatePath } from "next/cache";
import { checkUser } from "./checkUser";
import { redirect } from "next/navigation";

export default async function updateStatus(values: UpdateStatusType) {
    const { account } = await checkUser();

    if (!account) {
        redirect("/login");
    }

    if (
        Object.values(values).some(
            (value) => value === null || value === undefined
        )
    ) {
        return {
            error: "Please fill in all fields before updating the status (from the server).",
            success: false,
        };
    }

    const supabase = await createClient();

    // Fetch the user's most recent status
    const { data: previousStatus, error: previousStatusError } = await supabase
        .from("status")
        .select("safety, evacuation, readiness")
        .eq("account_id", account.id)
        .order("datetime", { ascending: false })
        .limit(1)
        .single();

    if (previousStatusError && previousStatusError.code !== "PGRST116") {
        // PGRST116 indicates no rows found
        console.error(previousStatusError);
        return {
            error: "Failed to fetch previous status",
            success: false,
        };
    }

    // Fetch all institution_ids from account_institution for the account
    const { data: accountInstitutions, error: accountInstitutionError } =
        await supabase
            .from("account_institution")
            .select("institution_id")
            .eq("account_id", account.id);

    if (
        accountInstitutionError ||
        !accountInstitutions ||
        accountInstitutions.length === 0
    ) {
        console.error(
            accountInstitutionError || "No institutions found for user"
        );
        return {
            error: "Failed to find associated institutions",
            success: false,
        };
    }

    // Prepare updates for institution counters based on status changes
    const updates = {
        safe: 0,
        unsafe: 0,
        pending: 0,
        evacuated: 0,
        ready: 0,
    };

    // Handle safety status changes
    const prevSafety = previousStatus?.safety || null;
    const newSafety = values.safety;

    if (newSafety === "safe" && prevSafety !== "safe") {
        updates.safe = 1;
        if (prevSafety === "unsafe") updates.unsafe = -1;
        else if (prevSafety === null) updates.pending = -1;
    } else if (newSafety === "unsafe" && prevSafety !== "unsafe") {
        updates.unsafe = 1;
        if (prevSafety === "safe") updates.safe = -1;
        else if (prevSafety === null) updates.pending = -1;
    } else if (
        newSafety !== "safe" &&
        newSafety !== "unsafe" &&
        prevSafety !== null
    ) {
        updates.pending = 1;
        if (prevSafety === "safe") updates.safe = -1;
        else if (prevSafety === "unsafe") updates.unsafe = -1;
    }

    // Handle evacuation status changes
    const prevEvacuation = previousStatus?.evacuation || null;
    if (values.evacuation === "evacuated" && prevEvacuation !== "evacuated") {
        updates.evacuated = 1;
    } else if (
        prevEvacuation === "evacuated" &&
        values.evacuation !== "evacuated"
    ) {
        updates.evacuated = -1;
    }

    // Handle readiness status changes
    const prevReadiness = previousStatus?.readiness || null;
    if (values.readiness === "ready" && prevReadiness !== "ready") {
        updates.ready = 1;
    } else if (prevReadiness === "ready" && values.readiness !== "ready") {
        updates.ready = -1;
    }

    // Update counters for each institution
    for (const { institution_id } of accountInstitutions) {
        // Fetch current institution data
        const { data: institutionData, error: fetchError } = await supabase
            .from("institution")
            .select("safe, unsafe, pending, evacuated, ready")
            .eq("id", institution_id)
            .single();

        if (fetchError || !institutionData) {
            console.error(
                fetchError ||
                    `Failed to fetch institution data for institution_id: ${institution_id}`
            );
            return {
                error: `Failed to fetch institution data for institution_id: ${institution_id}`,
                success: false,
            };
        }

        // Calculate new counter values, ensuring they don't go below 0
        const institutionUpdates = {
            safe: Math.max(0, (institutionData.safe || 0) + updates.safe),
            unsafe: Math.max(0, (institutionData.unsafe || 0) + updates.unsafe),
            pending: Math.max(
                0,
                (institutionData.pending || 0) + updates.pending
            ),
            evacuated: Math.max(
                0,
                (institutionData.evacuated || 0) + updates.evacuated
            ),
            ready: Math.max(0, (institutionData.ready || 0) + updates.ready),
        };

        // Update institution counters
        const { error: institutionError } = await supabase
            .from("institution")
            .update(institutionUpdates)
            .eq("id", institution_id);

        if (institutionError) {
            console.error(institutionError);
            return {
                error: institutionError,
                success: false,
            };
        }
    }

    // Insert the new status record
    const { error: statusError } = await supabase.from("status").insert({
        safety: values.safety,
        flood_height: parseFloat(values.floodHeight!),
        rain_intensity: parseFloat(values.rainIntensity!),
        wind_speed: parseFloat(values.windSpeed!),
        modality: values.modality,
        transportation: values.transportation,
        evacuation: values.evacuation,
        readiness: values.readiness,
        account_id: account.id,
    });

    if (statusError) {
        console.error(statusError);
        return {
            error: statusError,
            success: false,
        };
    }

    revalidatePath("/status");

    return {
        success: true,
        error: null,
    };
}
