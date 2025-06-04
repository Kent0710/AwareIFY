"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/db/supabase/server";
import { authFormSchema } from "@/schematypes";

import { z } from "zod";

export async function login(values: z.infer<typeof authFormSchema>) {
    const supabase = await createClient();

    const data = {
        email: values.username.replace(/\s+/g, "").toLowerCase() + "@gmail.com",
        password: values.password,
    };

    const { error } = await supabase.auth.signInWithPassword(data);

    if (error) {
        return {
            success: false,
            error: error,
        };
    }

    revalidatePath("/", "layout");
    redirect("/home");
}

export async function signup(values: z.infer<typeof authFormSchema>) {
    const supabase = await createClient();

    const data = {
        email: values.username.replace(/\s+/g, "").toLowerCase() + "@gmail.com",
        password: values.password,
    };

    const { data: user, error: signUpError } = await supabase.auth.signUp(data);

    if (signUpError || !user.user) {
        return {
            success: false,
            error: signUpError,
        };
    }

    const { error: insertError } = await supabase.from("account").insert({
        auth_user_id: user.user.id,
    });

    if (insertError) {
        return {
            success: false,
            error: insertError,
        };
    }

    revalidatePath("/", "layout");
    redirect("/home");
}

export async function signout() {
    const supabase = await createClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
        return {
            success: false,
            error: error,
        };
    }

    revalidatePath("/");
    redirect("/login");
}
