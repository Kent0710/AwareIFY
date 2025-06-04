"use server";

import { ConfigDataType } from "@/object-types";
import { createClient } from "@/lib/db/supabase/server";
import getAuthUser from "./getAuthUser";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function configureAccount(configData: ConfigDataType) {
    const supabase = await createClient();

    const authUser = await getAuthUser();

    const { username, longitude, latitude, placeName } = configData;

    const { error } = await supabase.from("account").update({
        primary_location_longitude: longitude,
        primary_location_latitude: latitude,
        place_name: placeName,
        username: username,
        isConfigured : true,
    }).eq('auth_user_id', authUser.user.id);

    if (error) {
        return {
            success : false,
            error : error,
        }
    };

    revalidatePath('/home')
    redirect('/home')
}
