import { z } from 'zod';

export const signUpSchema = z
    .object({
        name: z.string().min(2),
        email: z.string().email(),
        password: z.string().min(6),
        confirmPassword: z.string().min(6),
    })
    .refine((d) => d.password === d.confirmPassword, {
        message: 'Passwords must match',
        path: ['confirmPassword'],
    });

export const signInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});
