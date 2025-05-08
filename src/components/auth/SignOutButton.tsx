'use client';

import { signOut } from 'next-auth/react';

export default function SignOutButton({ children = 'Log out' }) {
    return (
        <button
            onClick={() => signOut({ callbackUrl: '/signin' })}
        >
            {children}
        </button>
    );
}
