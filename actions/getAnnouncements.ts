"use server";

import { createClient } from "@/lib/db/supabase/server";

export default async function getAnnouncement(institutionId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("announcement")
        .select("*")
        .eq("institution_id", institutionId)

    if (error) {
        console.error(error);
        return {
            success: false,
            error: error,
            announcements: [],
        };
    }

    return {
        success: true,
        error: null,
        announcements: data,
    };
}
