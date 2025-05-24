"use client";

// import { login, signup } from "@/actions/login";
import { authFormSchema } from "@/schematypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

import { Terminal, Loader2, LogIn } from "lucide-react";

export default function LoginPage() {
    const [authType, setAuthType] = useState<"login" | "signup">("signup");
    const [authError, setAuthError] = useState("");

    const form = useForm<z.infer<typeof authFormSchema>>({
        resolver: zodResolver(authFormSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    });

    const onSubmit = async () => {
        // if (authType === "login") {
        //     const res = await login(values);
        //     if (!res.success) {
        //         setAuthError(res.error);
        //     }
        // } else await signup(values);
    };

    return (
        <div className="flex justify-center items-center flex-col h-[100dvh] ">
            <div className="w-[30rem] h-fit">
                <Form {...form}>
                    <h2 className="text-xl font-semibold text-center">
                        {authType === "login"
                            ? "Welcome Back!"
                            : "Create an Account"}
                    </h2>
                    <p className="text-neutral-500 mb-6 text-center">
                        {authType === "login"
                            ? "Let's log you in"
                            : "Let's get you started"}
                    </p>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className={`space-y-8`}
                    >
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter username"
                                            {...field}
                                            autoComplete="off"
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Must be at least 2 characters long.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Enter password"
                                            {...field}
                                            autoComplete="off"
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Must be at least 5 characters long.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex gap-3 flex-wrap">
                            <Button
                                type="submit"
                                disabled={form.formState.isSubmitting}
                                className="w-full md:w-40 flex items-center justify-center gap-2"
                            >
                                {form.formState.isSubmitting ? (
                                    <Loader2 className="animate-spin" />
                                ) : (
                                    <LogIn />
                                )}
                                {form.formState.isSubmitting
                                    ? authType === "login"
                                        ? "Logging in..."
                                        : "Creating..."
                                    : authType === "login"
                                    ? "Log in"
                                    : "Create account"}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setAuthError("");
                                    setAuthType(
                                        authType === "login"
                                            ? "signup"
                                            : "login"
                                    );
                                    form.resetField("username");
                                    form.resetField("password");
                                }}
                                className="w-full md:w-fit"
                            >
                                {authType === "login"
                                    ? "Create account instead"
                                    : "Log in instead"}
                            </Button>
                        </div>
                    </form>
                    {authError && (
                        <Alert className="mt-3 border-red-500 border-1 text-red-500">
                            <Terminal />
                            <AlertTitle> Log in failed </AlertTitle>
                            <AlertDescription>{authError}</AlertDescription>
                        </Alert>
                    )}
                </Form>
            </div>
        </div>
    );
}
