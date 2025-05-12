import { z } from 'zod';
import zxcvbn from '@/lib/zxcvbn';

export const passwordSchema = z
    .string()
    .min(10, 'Must be at least 10 characters')
    .regex(/[a-z]/, 'Must contain a lowercase letter')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[0-9]/, 'Must contain a digit')
    .regex(/[^A-Za-z0-9]/, 'Must contain a symbol')
    .refine((v) => !/\s/.test(v), { message: 'No spaces allowed' })
    .refine((v) => zxcvbn(v).score >= 3, { message: 'Password is too weak' });

export const requestResetSchema = z.object({
    email: z.string().email(),
});

export const resetPasswordSchema = z
    .object({
        token: z.string().length(64, 'Invalid token'),
        email: z.string().email(),
        password: passwordSchema,
        confirmPassword: passwordSchema,
    })
    .refine((d) => d.password === d.confirmPassword, {
        message: 'Passwords must match',
        path: ['confirmPassword'],
    });
