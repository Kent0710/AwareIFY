"use server";

import { createClient } from "@/lib/db/supabase/server";
import { checkUser } from "./checkUser";
import { redirect } from "next/navigation";
import { InstitutionType } from "@/object-types";

// Type for the account_institution join result
interface AccountInstitution {
    institution: InstitutionType;
}

// Return type for the function
interface GetUserInstitutionsResponse {
    error: string | Error;
    success: boolean;
    institutions: AccountInstitution[];
}

export default async function getUserInstitutions(): Promise<GetUserInstitutionsResponse> {
    const supabase = await createClient();

    const user = await checkUser();

    if (!user.account) {
        console.log("Check user failed at getUserInstitutions.");
        redirect("/login");
    }

    const { data: institutions, error } = await supabase
        .from("account_institution")
        .select("institution:institution_id(*)")
        .eq("account_id", user.account.id);

    if (error) {
        return {
            error: error.message || "Failed to fetch institutions",
            success: false,
            institutions: [],
        };
    }

    return {
        error: "",
        success: true,
        institutions: (institutions || []).map((item: { institution: InstitutionType | InstitutionType[] }) => ({
            institution: Array.isArray(item.institution) ? item.institution[0] : item.institution,
        })) as AccountInstitution[],
    };
}
