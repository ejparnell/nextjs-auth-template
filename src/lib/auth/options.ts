import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { dbConnect } from '../dbConnect';
import { User } from '@/models/User';
import { signInSchema } from '@/schemas/user';
import bcrypt from 'bcryptjs';

export function buildAuthOptions(): NextAuthOptions {
    return {
        session: { strategy: 'jwt' },
        providers: [
            CredentialsProvider({
                name: 'credentials',
                credentials: {},
                async authorize(creds) {
                    const { email, password } = signInSchema.parse(creds);
                    await dbConnect();
                    const user = await User.findOne({ email }).select(
                        '+password'
                    );
                    if (!user) return null;
                    if (!user.emailVerified) {
                        throw new Error('Email not verified');
                    }
                    const ok = await bcrypt.compare(password, user.password);
                    if (!ok) return null;
                    return { id: user.id, name: user.name, email: user.email };
                },
            }),
        ],
    };
}
