import { z } from "zod";

export const registerSchema = z.object({
    email: z.email(),
    password: z.string().min(8),
    name: z.string().min(1).optional(),
    role: z.enum(["ADMIN", "USER"]).optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(8),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const createGuestSessionSchema = z.object({
    label: z.string().min(1).optional(),
});

export type CreateGuestSessionInput = z.infer<typeof createGuestSessionSchema>;
