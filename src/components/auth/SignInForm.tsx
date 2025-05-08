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

    const urlError = params.get('error') ?? '';
    const verified = params.get('verified') === '1';

    function mapUrlError(code: string) {
        switch (code) {
            case 'EmailNotVerified':
                return 'Verify your e‑mail before signing in.';
            case 'LinkExpired':
                return 'That verification link has expired. Click “resend verification”.';
            case 'InvalidLink':
                return 'Invalid verification link.';
            default:
                return null;
        }
    }

    const banner = verified
        ? { type: 'success', text: 'E‑mail verified! You can sign in now.' }
        : mapUrlError(urlError)
        ? { type: 'error', text: mapUrlError(urlError)! }
        : null;

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setFields({ ...fields, [e.target.name]: e.target.value });
        const next = { ...errors };
        delete next[e.target.name];
        setErrors(next);
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
        <>
            {banner && (
                <p
                    style={{
                        padding: '.5rem .75rem',
                        borderRadius: 6,
                        background:
                            banner.type === 'success' ? '#dcfce7' : '#fee2e2',
                        color:
                            banner.type === 'success' ? '#166534' : '#b91c1c',
                        marginBottom: '1rem',
                    }}
                >
                    {banner.text}
                </p>
            )}

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
                {errors.password && <p>{errors.password}</p>}

                {errors.global && <p>{errors.global}</p>}

                <button disabled={loading}>
                    {loading ? 'Signing in…' : 'Sign In'}
                </button>
            </form>
        </>
    );
}
