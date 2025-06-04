// actions/get-institution.ts
"use server";

import { createClient } from "@/lib/db/supabase/server";
import { AccountType } from "@/object-types";

interface Institution {
    institution_name: string;
    place_name: string;
    longitude: number;
    latitude: number;
    code: string;
    safe: number;
    unsafe: number;
    pending: number;
    evacuated: number;
    ready: number;
    id: string;
}

interface InstitutionResponse {
    success: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error: any | null;
    institution: Institution | null;
    accounts: AccountType[] | [];
}

export default async function getInstitutionById(
    institutionId: string
): Promise<InstitutionResponse> {
    if (!institutionId || typeof institutionId !== "string") {
        return {
            success: false,
            error: "Invalid institution ID",
            institution: null,
            accounts: [],
        };
    }

    const supabase = await createClient();

    // Fetch institution and related accounts via account_institution
    const { data, error } = await supabase
        .from("institution")
        .select(
            `
      *,
      account_institution (
        account (
          id, isConfigured, auth_user_id, username, primary_location_longitude, primary_location_latitude, place_name
        )
      )
    `
        )
        .eq("id", institutionId)
        .single();

    // Handle the case where no institution is found (expected behavior, e.g., after deletion)
    if (error && error.code === "PGRST116") {
        // PGRST116 is the Supabase/PostgREST error code for "no rows found"
        return {
            success: true,
            error: null,
            institution: null,
            accounts: [],
        };
    }

    // Handle other unexpected errors
    if (error) {
        console.error("Unexpected error fetching institution:", error);
        return {
            success: false,
            error: error.message,
            institution: null,
            accounts: [],
        };
    }

    // Extract accounts from the nested account_institution relation
    const accounts = data?.account_institution
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ? data.account_institution.map((ai: any) => ai.account).filter(Boolean)
        : [];

    return {
        success: true,
        error: null,
        institution: data ? { id: data.id, ...data } : null,
        accounts,
    };
}
