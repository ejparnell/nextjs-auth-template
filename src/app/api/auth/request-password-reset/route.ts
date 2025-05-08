import { NextRequest, NextResponse } from 'next/server';
import { requestResetSchema } from '@/schemas/password';
import { dbConnect } from '@/lib/dbConnect';
import { User } from '@/models/User';
import { createAndSendPasswordReset } from '@/lib/email/sendPasswordResetEmail';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
    const body = await req.json();
    const parsed = requestResetSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json(
            { errors: parsed.error.format() },
            { status: 400 }
        );
    }

    const { email } = parsed.data;
    await dbConnect();
    const user = await User.findOne({ email });

    if (user) {
        try {
            await createAndSendPasswordReset(
                user.id,
                email,
                req.nextUrl.origin
            );
        } catch (err) {
            console.error('sending reset mail failed', err);
        }
    }

    return NextResponse.json({ ok: true });
}
