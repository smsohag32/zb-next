import { z } from "zod";

export const profileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    email: z.string().email("Please enter a valid email address."),
    phone: z
        .string()
        .min(10, "Phone number must be at least 10 digits.")
        .max(15, "Phone number must not exceed 15 digits.")
        .optional()
        .or(z.literal("")),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
