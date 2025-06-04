"use server";

import { createClient } from "@/lib/db/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function deleteInstitution(institutionId: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("institution")
        .delete()
        .eq("id", institutionId);

    if (error) {
        console.error(error);
        return {
            success: false,
            error: error,
        };
    }

    revalidatePath("/admin");
    return {
        success : true,
        error : null
    }
}
