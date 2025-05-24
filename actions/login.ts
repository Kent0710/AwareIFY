"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/db/supabase/server";
import { authFormSchema } from "@/schematypes";

import {z} from 'zod'

export async function login(formData: FormData) {
    const supabase = await createClient();

    const data = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    };

    const { error } = await supabase.auth.signInWithPassword(data);

    if (error) {
        redirect("/error");
    }

    revalidatePath("/", "layout");
    redirect("/");
}

export async function signup(values : z.infer<typeof authFormSchema>) {
    const supabase = await createClient();

    const data = {
        email: values.username,
        password: values.password,
    };

    const { error } = await supabase.auth.signUp(data);

    if (error) {
        return {
            success : false,
            error : error,
        }
    }

    revalidatePath("/", "layout");
    redirect("/home");
}
