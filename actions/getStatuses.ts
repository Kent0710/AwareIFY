"use server";

import { createClient } from "@/lib/db/supabase/server";
import { checkUser } from "./checkUser";
import { redirect } from "next/navigation";

export default async function getStatuses() {
    const { account } = await checkUser();

    if (!account) {
        redirect("/login");
    }

    const supabase = await createClient();

    const { data, error } = await supabase
        .from("status")
        .select("*")
        .eq("account_id", account.id);

    if (error) {
        return {
            error : error,
            success : false,
            statuses : []
        }
    };

    return {
        error : null,
        success : true,
        statuses : data
    }
}
