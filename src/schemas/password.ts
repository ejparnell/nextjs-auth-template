import { z } from 'zod';

export const requestResetSchema = z.object({
    email: z.string().email(),
});

export const resetPasswordSchema = z
    .object({
        token: z.string().length(64, 'Invalid token'),
        email: z.string().email(),
        password: z.string().min(6),
        confirmPassword: z.string().min(6),
    })
    .refine((d) => d.password === d.confirmPassword, {
        message: 'Passwords must match',
        path: ['confirmPassword'],
    });
