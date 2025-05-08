'use client';

import { useState, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { signInSchema } from '@/schemas/user';
import { zodToFormErrors } from '@/lib/zodToFormErrors';

export default function SignInForm() {
    const [fields, setFields] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const params = useSearchParams();

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setFields({ ...fields, [e.target.name]: e.target.value });
        const updatedErrors = { ...errors };
        delete updatedErrors[e.target.name];
        setErrors(updatedErrors);
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();

        const parsed = signInSchema.safeParse(fields);
        if (!parsed.success) {
            setErrors(zodToFormErrors(parsed.error));
            return;
        }

        setLoading(true);

        const res = await signIn('credentials', {
            redirect: false,
            ...fields,
            callbackUrl: params.get('callbackUrl') ?? '/dashboard',
        });

        setLoading(false);

        if (res?.error) {
            setErrors({ global: 'Invalid credentials' });
            return;
        }

        router.push(res?.url ?? '/dashboard');
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                name='email'
                type='email'
                placeholder='Email'
                value={fields.email}
                onChange={handleChange}
            />
            {errors.email && <p>{errors.email}</p>}

            <input
                name='password'
                type='password'
                placeholder='Password'
                value={fields.password}
                onChange={handleChange}
            />
            {errors.password && (
                <p>{errors.password}</p>
            )}

            {errors.global && <p>{errors.global}</p>}

            <button disabled={loading}>
                {loading ? 'Signing in…' : 'Sign In'}
            </button>
        </form>
    );
}
