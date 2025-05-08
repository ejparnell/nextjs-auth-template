import { NextRequest, NextResponse } from 'next/server';
import { resetPasswordSchema } from '@/schemas/password';
import { dbConnect } from '@/lib/dbConnect';
import { VerificationToken } from '@/models/VerificationToken';
import { User } from '@/models/User';
import crypto from 'crypto';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
    const body = await req.json();
    const parsed = resetPasswordSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json(
            { errors: parsed.error.format() },
            { status: 400 }
        );
    }

    const { token, email, password } = parsed.data;
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    await dbConnect();

    const record = await VerificationToken.findOne({
        tokenHash,
        kind: 'password',
    });
    if (!record || record.expiresAt < new Date()) {
        return NextResponse.json(
            { errors: { token: 'Link expired' } },
            { status: 400 }
        );
    }

    const user = await User.findById(record.userId);
    if (!user || user.email.toLowerCase() !== email.toLowerCase()) {
        return NextResponse.json(
            { errors: { token: 'Invalid token' } },
            { status: 400 }
        );
    }

    user.password = password;
    await user.save();
    await VerificationToken.deleteOne({ _id: record._id });

    return NextResponse.json({ ok: true });
}
