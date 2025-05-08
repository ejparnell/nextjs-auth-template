import { ZodError } from 'zod';

export function zodToFormErrors(err: ZodError) {
    const errors: Record<string, string> = {};
    err.errors.forEach((e) => {
        const key = e.path[0] as string;
        if (!errors[key]) errors[key] = e.message;
    });
    return errors;
}
