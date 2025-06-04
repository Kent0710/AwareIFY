"use client";

import {
    Dialog,
    DialogClose,
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
import { createInstitutionformSchema } from "@/schematypes";
import createInstitution from "@/actions/createInstitution";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import PinLocationPicker, { LocationInfo } from "./pin-location-picker";
import { Label } from "./ui/label";
import Link from "next/link";

interface FormattedValuesInstitutionType {
    institutionName: string;
    longitude: number;
    latitude: number;
    placeName: string;
}

const CreateInstitution = () => {
    const [configError, setConfigError] = useState("");
    const [location, setLocation] = useState<LocationInfo | null>(null);
    const [createdInstitution, setCreatedInstitution] = useState<{
        institutionName: string;
        institutionCode: string;
        institutionId: string;
    } | null>(null);

    const form = useForm<z.infer<typeof createInstitutionformSchema>>({
        resolver: zodResolver(createInstitutionformSchema),
        defaultValues: {
            institutionName: "",
        },
    });

    const onSubmit = async (
        values: z.infer<typeof createInstitutionformSchema>
    ) => {
        if (
            !location?.longitude ||
            !location?.latitude ||
            !location?.placeName
        ) {
            setConfigError(
                "Location is not fully configured. Please pin your primary location."
            );
            return;
        }

        const { longitude, latitude, placeName } = location;

        const formattedValues: FormattedValuesInstitutionType = {
            institutionName: values.institutionName,
            longitude,
            latitude,
            placeName,
        };

        const res = await createInstitution(formattedValues);

        if (!res.success && res.error) {
            setConfigError(res.error.toString());
            return;
        }

        if (!res.institution) {
            setConfigError("Institution data is missing.");
            return;
        }

        setCreatedInstitution({
            institutionName: res.institution.name,
            institutionCode: res.institution.code,
            institutionId: res.institution.id,
        });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="secondary">Create institution</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Institution</DialogTitle>
                    <DialogDescription>
                        Created institution might be fake for testing purposes.
                    </DialogDescription>
                </DialogHeader>

                {!createdInstitution ? (
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-3"
                        >
                            {/* Institution Name */}
                            <FormField
                                control={form.control}
                                name="institutionName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Institution Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g. Greenfield High School"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="h-[50dvh] pb-6">
                                <Label>
                                    {" "}
                                    Pin your institution&apos;s location{" "}
                                </Label>
                                <PinLocationPicker
                                    location={location}
                                    setLocation={setLocation}
                                />
                            </div>

                            {/* Submit */}
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={form.formState.isSubmitting}
                            >
                                {form.formState.isSubmitting ? (
                                    <>
                                        <Loader2 className="animate-spin" />{" "}
                                        Creating institution...
                                    </>
                                ) : (
                                    <> Create institution </>
                                )}
                            </Button>
                            <small className="text-center">{configError}</small>
                        </form>
                    </Form>
                ) : (
                    <section className="space-y-3">
                        <p className="text-center">
                            {" "}
                            Insitution successfully created.{" "}
                        </p>
                        <div>
                            <Label htmlFor="institutionName">
                                Institution Name
                            </Label>
                            <Input
                                disabled
                                placeholder={createdInstitution.institutionName}
                            />
                        </div>
                        <div>
                            <Label htmlFor="institutionCode">
                                Institution Code
                            </Label>
                            <Input
                                disabled
                                placeholder={createdInstitution.institutionCode}
                            />
                        </div>
                        <div>
                            <Link
                                href={`/institution/${createdInstitution.institutionId}`}
                            >
                                <Button> Open created institution </Button>
                            </Link>
                            <DialogClose asChild>
                                <Button variant={"secondary"}>Close</Button>
                            </DialogClose>
                        </div>
                    </section>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default CreateInstitution;
