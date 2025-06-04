'use server'

import { createClient } from "@/lib/db/supabase/server"
import { redirect } from "next/navigation";

export default async function getAuthUser() {
    const supabase = await createClient();
    
    const { data : authUserData, error : authError } = await supabase.auth.getUser();

    if (authError) {
        redirect('/login')
    };

    return authUserData;
}