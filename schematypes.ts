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

export const configFormSchema = z.object({
    username: z
        .string()
        .min(3, { message: "Username must be at least 3 characters long" })
        .max(50, { message: "Username cannot exceed 30 characters" })
        .regex(/^[a-zA-Z0-9_]+$/, {
            message:
                "Username can only contain letters, numbers, and underscores",
        }),
});

export const createInstitutionformSchema = z.object({
    institutionName: z.string().min(1, "Institution name is required"),
});

export const createAnnouncementFormSchema = z.object({
    mainText: z
        .string()
        .min(1, "Main text is required")
        .max(500, "Main text must be 500 characters or less"),
    description: z
        .string()
        .max(1000, "Description must be 1000 characters or less")
});