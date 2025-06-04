"use server";

import { createClient } from "@/lib/db/supabase/server";
import { UpdateStatusType } from "@/object-types";
import { revalidatePath } from "next/cache";
import { checkUser } from "./checkUser";
import { redirect } from "next/navigation";

export default async function updateStatus(values: UpdateStatusType) {
    const {account} = await checkUser();

    if (!account) {
        redirect('/login')
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

    const { error } = await supabase.from("status").insert({
        is_safe: values.safety,
        flood_height: parseFloat(values.floodHeight!),
        rain_intensity: parseFloat(values.rainIntensity!),
        wind_speed: parseFloat(values.windSpeed!),
        modality: values.modality,
        transportation: values.transportation,
        evacuation: values.evacuation,
        readiness: values.readiness,
        account_id : account.id
    });

    if (error) {
        console.error(error)
        return {
            error : error,
            success : false,
        }
    };

    revalidatePath('/status');

    return {
        success : true,
        error : null,
    }
}
