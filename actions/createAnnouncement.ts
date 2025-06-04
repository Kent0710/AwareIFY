'use server'

import { createAnnouncementFormSchema } from './../schematypes';
import {z} from 'zod'
import { checkUser } from './checkUser';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export default async function createAnnouncement(values : z.infer<typeof createAnnouncementFormSchema>, institutionId : string) {
    const {account, supabase} = await checkUser();

    if (!account) {
        redirect('/configure')
    };

    const { error } = await supabase
        .from('announcement')
        .insert({
            main_text: values.mainText,
            description: values.description,
            author_username: account.username,
            institution_id: institutionId,
        });

    if (error) {
        console.error(error);
        return {
            error : error,
            success : false,
        }
    };

    revalidatePath('/admin/[id]');

    return {
        success : true,
        error : null,
    }
}