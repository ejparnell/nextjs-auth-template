'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Turnstile from 'react-turnstile';
import { signUpSchema } from '@/schemas/user';
import { zodToFormErrors } from '@/lib/zodToFormErrors';

export default function SignUpForm() {
    const [fields, setFields] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        turnstileToken: '',
    });
    const [errors, setErrors] = useState<Record<string, string | undefined>>(
        {}
    );
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
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

        setSubmitted(true);
        setLoading(false);
    }

    if (submitted) {
        return (
            <div>
                <h2>Almost there!</h2>
                <p>
                    We’ve sent a verification link to{' '}
                    <strong>{fields.email}</strong>.
                    <br />
                    Click the link to activate your account.
                </p>
                <button onClick={() => router.push('/signin')}>
                    Back to sign‑in
                </button>
            </div>
        );
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

            <Turnstile
                sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITEKEY!}
                onSuccess={(token) =>
                    setFields((f) => ({ ...f, turnstileToken: token }))
                }
            />

            {errors.global && <p>{errors.global}</p>}

            <button disabled={loading || !fields.turnstileToken}>
                {loading ? 'Creating…' : 'Sign Up'}
            </button>
        </form>
    );
}
