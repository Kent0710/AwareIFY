"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { createAnnouncementFormSchema } from "@/schematypes";
import createAnnouncement from "@/actions/createAnnouncement";
import { toast } from "sonner";

interface CreateAnnouncementProps {
    institutionId: string;
}
const CreateAnnouncement: React.FC<CreateAnnouncementProps> = ({
    institutionId,
}) => {
    const [open, setOpen] = useState(false);
    const [configError, setConfigError] = useState("");

    const form = useForm<z.infer<typeof createAnnouncementFormSchema>>({
        resolver: zodResolver(createAnnouncementFormSchema),
        defaultValues: {
            mainText: "",
            description: "",
        },
    });

    const onSubmit = async (
        values: z.infer<typeof createAnnouncementFormSchema>
    ) => {
        const res = await createAnnouncement(values, institutionId);

        if (!res.success && res.error) {
            setConfigError(res.error.toString());
            return;
        }

        toast.success("Successfully created announcement.");
        setOpen(false);
        form.reset();
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="mb-3">Create Announcement</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Announcement</DialogTitle>
                    <DialogDescription>
                        Fill in the details to create a new announcement for the
                        institution.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-3"
                    >
                        {/* Main Text */}
                        <FormField
                            control={form.control}
                            name="mainText"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Main Text</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g. School Closure Notice"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Description */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g. Details about the announcement"
                                            {...field}
                                            value={field.value}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Submit */}
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={form.formState.isSubmitting}
                        >
                            {form.formState.isSubmitting ? (
                                <>
                                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                                    Creating announcement...
                                </>
                            ) : (
                                <>Create Announcement</>
                            )}
                        </Button>
                        {configError && (
                            <small className="text-center text-red-500">
                                {configError}
                            </small>
                        )}
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateAnnouncement;
