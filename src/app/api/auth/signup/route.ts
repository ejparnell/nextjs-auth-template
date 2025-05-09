import { NextResponse, type NextRequest } from 'next/server';
import { signUpSchema } from '@/schemas/user';
import { dbConnect } from '@/lib/dbConnect';
import { User } from '@/models/User';
import { createAndSendVerification } from '@/lib/email/sendVerificationEmail';
import { limit } from '@/lib/rateLimit';
import { verifyTurnstile } from '@/lib/turnstile';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
    const ip =
        (
            req.headers.get('x-forwarded-for') ??
            req.headers.get('x-real-ip') ??
            ''
        )
            .split(',')[0]
            .trim() || '127.0.0.1';

    await limit(ip);

    const { turnstileToken, ...body } = await req.json();
    await verifyTurnstile(turnstileToken, ip);

    const parsed = signUpSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json(
            { errors: parsed.error.format() },
            { status: 400 }
        );
    }

    const { name, email, password } = parsed.data;
    await dbConnect();

    const exists = await User.findOne({ email });
    if (exists) {
        return NextResponse.json(
            { errors: { email: 'Email already in use' } },
            { status: 409 }
        );
    }

    const user = await new User({ name, email, password }).save();

    await createAndSendVerification(user.id, email);

    return NextResponse.json({ ok: true }, { status: 201 });
}
