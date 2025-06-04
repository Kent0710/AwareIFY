"use server";

import { createClient } from "@/lib/db/supabase/server";
import { checkUser } from "./checkUser";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

interface InstitutionParamsType {
    institutionName : string;
    longitude : number;
    latitude : number;
    placeName : string;
}

export default async function createInstitution(values: InstitutionParamsType) {
    const { account } = await checkUser();
    if (!account) redirect("/login");

    const { institutionName, longitude, latitude, placeName } = values;
    const supabase = await createClient();

    // Helper to generate a random 6-character alphanumeric code
    const generateCode = () => {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    };

    // Helper to check code uniqueness
    const isCodeUnique = async (code: string): Promise<boolean> => {
        const { data } = await supabase
            .from("institution")
            .select("id")
            .eq("join_code", code)
            .maybeSingle();
        return !data;
    };

    // Generate a unique join code
    let joinCode = generateCode();
    let attemptCount = 0;

    while (!(await isCodeUnique(joinCode)) && attemptCount < 10) {
        joinCode = generateCode();
        attemptCount++;
    }

    if (attemptCount >= 10) {
        return {
            error: "Failed to generate a unique join code.",
            success: false,
            institution: undefined,
        };
    }

    const { data: institutionData, error: createInstitutionError } =
        await supabase
            .from("institution")
            .insert({
                institution_name: institutionName,
                longitude,
                latitude,
                place_name: placeName,
                code: joinCode,
            })
            .select()
            .single();

    if (createInstitutionError || !institutionData) {
        return {
            error: createInstitutionError,
            success: false,
            institution: undefined,
        };
    }

    const { error: accountInstitutionError } = await supabase
        .from("account_institution")
        .insert({
            account_id: account.id,
            institution_id: institutionData.id,
        });

    if (accountInstitutionError) {
        await supabase
            .from("institution")
            .delete()
            .eq("id", institutionData.id);
        return {
            error: accountInstitutionError,
            success: false,
            institution: undefined,
        };
    }

    revalidatePath('/home')

    return {
        error: '',
        success: true,
        institution: {
            name: values.institutionName,
            code: joinCode,
            id : institutionData.id
        },
    };
}
