"use server";

import { redirect } from "next/navigation";
import { checkUser } from "./checkUser";
import { revalidatePath } from "next/cache";

export default async function joinInstitution(institutionCode: string) {
    const { account, supabase } = await checkUser();

    if (!account) {
        redirect("/login");
    }

    const { data: institution, error: institutionError } = await supabase
        .from("institution")
        .select("id")
        .eq("code", institutionCode).single()

    if (institutionError) {
        console.error("Error fetching institution:", institutionError);
        return {
            success: false,
            error: "Failed to fetch institution. See console.",
        };
    }

    const { error } = await supabase.from("account_institution").insert({
        account_id: account.id,
        institution_id: institution.id,
    });

    if (error) {
        console.error("Error joining institution:", error);
        return {
            success: false,
            error: "Failed to join institution. See console.",
        };
    }

    revalidatePath("/home");
    revalidatePath("/admin");

    return {
        success: true,
        error: null,
    };
}
