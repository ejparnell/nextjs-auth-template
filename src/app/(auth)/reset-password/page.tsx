'use client';

import { useState, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { resetPasswordSchema } from '@/schemas/password';
import { zodToFormErrors } from '@/lib/zodToFormErrors';

export default function ResetPasswordPage() {
    const params = useSearchParams();
    const token = params.get('token') ?? '';
    const email = params.get('email') ?? '';
    const router = useRouter();

    const [fields, setFields] = useState({
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();

        const parsed = resetPasswordSchema.safeParse({
            token,
            email,
            ...fields,
        });
        if (!parsed.success) {
            setErrors(zodToFormErrors(parsed.error));
            return;
        }

        setLoading(true);
        const res = await fetch('/api/auth/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, email, ...fields }),
        });
        setLoading(false);

        if (!res.ok) {
            const data = await res.json();
            setErrors(data.errors ?? { global: 'Something went wrong' });
            return;
        }

        setDone(true);
        setTimeout(() => router.push('/signin'), 2500);
    }

    if (done) return <p>Password updated! Redirecting to sign‑in…</p>;

    return (
        <form onSubmit={handleSubmit}>
            <p>
                Reset password for <strong>{email}</strong>
            </p>

            <input
                name='password'
                type='password'
                placeholder='New password'
                value={fields.password}
                onChange={(e) =>
                    setFields({ ...fields, password: e.target.value })
                }
            />

            <input
                name='confirmPassword'
                type='password'
                placeholder='Confirm password'
                value={fields.confirmPassword}
                onChange={(e) =>
                    setFields({ ...fields, confirmPassword: e.target.value })
                }
            />
            {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
            {errors.global && <p>{errors.global}</p>}

            <button disabled={loading}>
                {loading ? 'Updating…' : 'Reset password'}
            </button>
        </form>
    );
}
