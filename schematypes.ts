import { z } from "zod";

export const authFormSchema = z.object({
    username: z
        .string()
        .min(2, { message: "Username must be atleast 2 characters long" })
        .max(30, { message: "Username must be at most 30 characters long" }),
    password: z
        .string()
        .min(5, { message: "Password must be atleast 5 characters long" })
        .max(30, { message: "Password must be at most 30 characters long" }),
});
