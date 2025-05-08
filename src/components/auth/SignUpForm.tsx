'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { signUpSchema } from '@/schemas/user';
import { zodToFormErrors } from '@/lib/zodToFormErrors';
import { signIn } from 'next-auth/react';

export default function SignUpForm() {
    const [fields, setFields] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState<Record<string, string | undefined>>(
        {}
    );
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setFields({ ...fields, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: undefined });
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();

        const parsed = signUpSchema.safeParse(fields);
        if (!parsed.success) {
            setErrors(zodToFormErrors(parsed.error));
            return;
        }

        setLoading(true);

        const res = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(fields),
        });

        if (!res.ok) {
            const data = await res.json();
            setErrors(data.errors ?? { global: 'Something went wrong' });
            setLoading(false);
            return;
        }

        await signIn('credentials', {
            redirect: false,
            email: fields.email,
            password: fields.password,
            callbackUrl: '/dashboard',
        });

        router.push('/dashboard');
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                name='name'
                placeholder='Name'
                value={fields.name}
                onChange={handleChange}
            />
            {errors.name && <p>{errors.name}</p>}

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

            <input
                name='confirmPassword'
                type='password'
                placeholder='Confirm password'
                value={fields.confirmPassword}
                onChange={handleChange}
            />
            {errors.confirmPassword && <p>{errors.confirmPassword}</p>}

            {errors.global && <p>{errors.global}</p>}

            <button disabled={loading}>
                {loading ? 'Creating account…' : 'Sign Up'}
            </button>
        </form>
    );
}
