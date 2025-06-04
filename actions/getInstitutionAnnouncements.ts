"use server";

import { redirect } from "next/navigation";
import { checkUser } from "./checkUser";

export default async function getInstitutionAnnouncements(
    institutionId: string
) {
    const { account, supabase } = await checkUser();

    if (!account) {
        redirect("/configure");
    }

    const { data, error } = await supabase
        .from("announcement")
        .select("*")
        .eq("institution_id", institutionId);

    if (error) {
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
