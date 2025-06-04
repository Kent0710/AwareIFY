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
import { useState } from "react";
import joinInstitution from "@/actions/joinInstitution";
import { toast } from "sonner";

// Define the Zod schema for the form
const joinInstitutionFormSchema = z.object({
    institutionCode: z
        .string()
        .min(1, "Institution code is required")
        .max(6, "Institution code must be 6 characters or less"),
});

const JoinInstitution = () => {
    const [open, setOpen] = useState(false);
    const [error, setError] = useState("");

    const form = useForm<z.infer<typeof joinInstitutionFormSchema>>({
        resolver: zodResolver(joinInstitutionFormSchema),
        defaultValues: {
            institutionCode: "",
        },
    });

    const onSubmit = async (
        values: z.infer<typeof joinInstitutionFormSchema>
    ) => {
        const res = await joinInstitution(values.institutionCode);

        if (!res.success && res.error) {
            setError(res.error.toString());
            return;
        }

        toast.success("Successfully joined institution.");
        setOpen(false); 
        form.reset(); 
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Join Institution</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Join Institution</DialogTitle>
                    <DialogDescription>
                        Enter the institution code to join an existing
                        institution.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-3"
                    >
                        {/* Institution Code */}
                        <FormField
                            control={form.control}
                            name="institutionCode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Institution Code</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g. ABC123"
                                            {...field}
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
                                    Joining institution...
                                </>
                            ) : (
                                <>Join Institution</>
                            )}
                        </Button>
                        {error && (
                            <small className="text-center text-red-500">
                                {error}
                            </small>
                        )}
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default JoinInstitution;
