import { withAuth } from 'next-auth/middleware';

export default withAuth({
    pages: { signIn: '/signin' },
});

export const config = {
    matcher: [
        '/((?!auth|signin|signup|api/verify-email|logout|_next/static|_next/image).*)',
    ],
};
