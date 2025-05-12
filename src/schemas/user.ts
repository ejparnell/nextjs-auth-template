import { z } from 'zod';
import { passwordSchema } from './password';

export const signUpSchema = z
    .object({
        name: z.string().min(2),
        email: z.string().email(),
        password: passwordSchema,
        confirmPassword: passwordSchema,
    })
    .refine((d) => d.password === d.confirmPassword, {
        message: 'Passwords must match',
        path: ['confirmPassword'],
    });

export const signInSchema = z.object({
    email: z.string().email(),
    password: passwordSchema,
});
