import { withAuth } from 'next-auth/middleware';

export default withAuth({
    pages: { signIn: '/signin' },
});

export const config = {
    matcher: [
        '/((?!auth|signin|signup|api/verify-email|logout|forgot-password|reset-password|api/auth/request-password-reset|api/auth/reset-password|_next/static|_next/image).*)',
    ],
};
