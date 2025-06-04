"use server";

import { redirect } from "next/navigation";
import { checkUser } from "./checkUser";
import { revalidatePath } from "next/cache";

export default async function joinInstitution(institutionCode: string) {
    const { account, supabase } = await checkUser();

    if (!account) {
        redirect("/login");
    }

    // Fetch institution by code
    const { data: institution, error: fetchInstitutionError } = await supabase
        .from("institution")
        .select("id")
        .eq("code", institutionCode)
        .single();

    if (fetchInstitutionError) {
        console.error("Error fetching institution:", fetchInstitutionError);
        return {
            success: false,
            error: "Failed to fetch institution. See console.",
        };
    }

    // Fetch the user's most recent status
    const { data: previousStatus, error: previousStatusError } = await supabase
        .from("status")
        .select("is_safe, evacuation, readiness")
        .eq("account_id", account.id)
        .order("datetime", { ascending: false })
        .limit(1)
        .single();

    if (previousStatusError && previousStatusError.code !== "PGRST116") {
        // PGRST116 indicates no rows found
        console.error("Error fetching previous status:", previousStatusError);
        return {
            success: false,
            error: "Failed to fetch user status. See console.",
        };
    }

    // Insert the account_institution record
    const { error: insertError } = await supabase
        .from("account_institution")
        .insert({
            account_id: account.id,
            institution_id: institution.id,
        });

    if (insertError) {
        console.error("Error joining institution:", insertError);
        return {
            success: false,
            error: "Failed to join institution. See console.",
        };
    }

    // Fetch current institution data
    const { data: institutionData, error: fetchError } = await supabase
        .from("institution")
        .select("safe, unsafe, pending, evacuated, ready")
        .eq("id", institution.id)
        .single();

    if (fetchError || !institutionData) {
        console.error(
            fetchError ||
                `Failed to fetch institution data for institution_id: ${institution.id}`
        );
        return {
            success: false,
            error: `Failed to fetch institution data`,
        };
    }

    // Prepare updates for institution counters based on user's latest status
    const updates = {
        safe: institutionData.safe || 0,
        unsafe: institutionData.unsafe || 0,
        pending: institutionData.pending || 0,
        evacuated: institutionData.evacuated || 0,
        ready: institutionData.ready || 0,
    };

    // If no previous status, increment pending
    if (!previousStatus) {
        updates.pending += 1;
    } else {
        // Update counters based on status
        if (previousStatus.is_safe === "safe") {
            updates.safe += 1;
        } else if (previousStatus.is_safe === "unsafe") {
            updates.unsafe += 1;
        } else {
            updates.pending += 1;
        }

        if (previousStatus.evacuation === "evacuated") {
            updates.evacuated += 1;
        }

        if (previousStatus.readiness === "ready") {
            updates.ready += 1;
        }
    }

    // Update institution counters
    const { error: institutionError } = await supabase
        .from("institution")
        .update(updates)
        .eq("id", institution.id);

    if (institutionError) {
        console.error("Error updating institution counters:", institutionError);
        return {
            success: false,
            error: "Failed to update institution counters. See console.",
        };
    }

    revalidatePath("/home");
    revalidatePath("/admin");

    return {
        success: true,
        error: null,
    };
}
