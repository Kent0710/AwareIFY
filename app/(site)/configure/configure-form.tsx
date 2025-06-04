"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Pin } from "lucide-react";
import AwareIFYLogo from "@/public/awareify-logo.jpg";
import Image from "next/image";
import PinLocationPicker from "../../../components/pin-location-picker";
import { LocationInfo } from "../../../components/pin-location-picker";
import { useState } from "react";
import configureAccount from "@/actions/configure-account";

import { configFormSchema } from "@/schematypes";
import { ConfigDataType } from "@/object-types";

const ConfigureForm = () => {
    const [configError, setConfigError] = useState("");
    const [location, setLocation] = useState<LocationInfo | null>(null);

    const form = useForm<z.infer<typeof configFormSchema>>({
        resolver: zodResolver(configFormSchema),
        defaultValues: {
            username: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof configFormSchema>) => {
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

        const configData: ConfigDataType = {
            username: values.username,
            longitude,
            latitude,
            placeName,
        };

        const res = await configureAccount(configData);

        if (!res.success) setConfigError(res.error.toString());
    };

    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 h-[80dvh]">
            <section className="flex justify-center items-center flex-col space-y-6 p-10 lg:mb-10">
                <h2 className="text-5xl lg:text-7xl font-semibold text-center">
                    Let us configure your account.
                </h2>
                <p className="secondary-text text-center">
                    Account configuration is required before joining
                    institutions
                </p>
            </section>

            <section className="flex justify-center items-center flex-col p-10">
                {/* error section  */}

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6 w-full md:px-[10rem]"
                    >
                        {configError && (
                            <div className="text-red-500 text-center border border-red-500 rounded-lg py-2 font-semibold">
                                <small> {configError} </small>
                            </div>
                        )}
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your username"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        This will serve as your public display
                                        name.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Dialog>
                            <DialogTrigger asChild className="block">
                                <Button
                                    variant={"outline"}
                                    className="flex items-center gap-3 w-full"
                                >
                                    <Pin />
                                    {location ? (
                                        <>{location.placeName}</>
                                    ) : (
                                        <>Pin your primary location</>
                                    )}
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        Pin your primary location
                                    </DialogTitle>
                                    <DialogDescription>
                                        Primary location will be your most of
                                        the time location. You can add a
                                        secondary location for changing
                                        location.
                                    </DialogDescription>
                                    <div className="h-[60dvh]">
                                        <PinLocationPicker
                                            location={location}
                                            setLocation={setLocation}
                                        />
                                    </div>
                                    <DialogClose asChild>
                                        <Button
                                            disabled={location ? false : true}
                                        >
                                            Pin selected location as primary
                                            location
                                        </Button>
                                    </DialogClose>
                                </DialogHeader>
                            </DialogContent>
                        </Dialog>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={form.formState.isSubmitting}
                        >
                            {form.formState.isSubmitting ? (
                                <>
                                    <Loader2 className="animate-spin" />{" "}
                                    Configuring...
                                </>
                            ) : (
                                <> Confirm configuration </>
                            )}
                        </Button>
                    </form>
                </Form>
            </section>
        </div>
    );
}

export default ConfigureForm;