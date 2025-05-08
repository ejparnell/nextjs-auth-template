'use client';

import { useState, FormEvent } from 'react';
import { requestResetSchema } from '@/schemas/password';
import { zodToFormErrors } from '@/lib/zodToFormErrors';

export default function RequestResetForm() {
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        const parsed = requestResetSchema.safeParse({ email });
        if (!parsed.success) {
            setErrors(zodToFormErrors(parsed.error));
            return;
        }

        setLoading(true);
        await fetch('/api/auth/request-password-reset', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });
        setLoading(false);
        setSent(true);
    }

    if (sent) {
        return (
            <p>
                Check <strong>{email}</strong> for a reset link.
            </p>
        );
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                name='email'
                type='email'
                placeholder='Email'
                value={email}
                onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors({});
                }}
            />
            {errors.email && <p>{errors.email}</p>}
            <button disabled={loading}>
                {loading ? 'Sending…' : 'Send reset link'}
            </button>
        </form>
    );
}
