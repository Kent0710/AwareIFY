import { createClient } from "@/lib/db/supabase/server";
import getAuthUser from "./getAuthUser";

export async function checkUser() {
    const supabase = await createClient();

    const authUser = await getAuthUser();

    const authUserId = authUser.user.id;

    const { data: account, error: retrieveError } = await supabase
        .from("account")
        .select("*")
        .eq("auth_user_id", authUserId)
        .single();

    if (retrieveError) {
        return {
            success: false,
            error: retrieveError,
            isConfigured: undefined,
            account: undefined,
            supabase : supabase
        };
    }

    return {
        success: true,
        error: null,
        isConfigured: account.isConfigured,
        account: account,
        supabase: supabase,
    };
}
