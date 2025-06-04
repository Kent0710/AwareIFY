"use server";

import { createClient } from "@/lib/db/supabase/server";

export default async function getStatus(accountId: string) {
    const supabase = await createClient();

    const { data: status, error } = await supabase
        .from("status")
        .select("*")
        .eq("account_id", accountId)
        .order("datetime", { ascending: false })
        .limit(1);

    if (error) {
        console.error("Error fetching status:", error);
        return {
            success: false,
            error: error,
            status: null,
        };
    }

    return {
        success: true,
        error: null,
        status,
    };
}
