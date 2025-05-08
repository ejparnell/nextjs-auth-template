import { withAuth } from 'next-auth/middleware';

export default withAuth({
    pages: { signIn: '/signin' },
});

export const config = {
    matcher: ['/((?!auth|signin|signup|logout|_next/static|_next/image).*)'],
};
