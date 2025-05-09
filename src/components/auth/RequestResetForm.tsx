'use client';

import { useState, FormEvent } from 'react';
import Turnstile from 'react-turnstile';
import { requestResetSchema } from '@/schemas/password';
import { zodToFormErrors } from '@/lib/zodToFormErrors';

export default function RequestResetForm() {
    const [form, setForm] = useState({ email: '', turnstileToken: '' });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        const parsed = requestResetSchema.safeParse({ email: form.email });
        if (!parsed.success) {
            setErrors(zodToFormErrors(parsed.error));
            return;
        }

        setLoading(true);
        await fetch('/api/auth/request-password-reset', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        });
        setLoading(false);
        setSent(true);
    }

    if (sent)
        return (
            <p>
                Check <strong>{form.email}</strong> for a reset link.
            </p>
        );

    return (
        <form onSubmit={handleSubmit}>
            <input
                type='email'
                placeholder='Email'
                value={form.email}
                onChange={(e) => {
                    setForm({ ...form, email: e.target.value });
                    setErrors({});
                }}
            />
            {errors.email && <p>{errors.email}</p>}

            <Turnstile
                sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITEKEY!}
                onSuccess={(t) => setForm((f) => ({ ...f, turnstileToken: t }))}
            />

            <button disabled={loading || !form.turnstileToken}>
                {loading ? 'Sending…' : 'Send reset link'}
            </button>
        </form>
    );
}
