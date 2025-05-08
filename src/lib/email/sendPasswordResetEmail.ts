import { Resend } from 'resend';
import crypto from 'crypto';
import { VerificationToken } from '@/models/VerificationToken';

const resend = new Resend(process.env.RESEND_API_KEY as string);

export async function createAndSendPasswordReset(
    userId: string,
    email: string,
    origin: string
) {
    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    await VerificationToken.create({
        userId,
        tokenHash,
        kind: 'password',
        expiresAt: new Date(Date.now() + 30 * 60 * 1_000),
    });

    const url = `${origin}/reset-password?token=${token}&email=${encodeURIComponent(
        email
    )}`;
    await resend.emails.send({
        from: process.env.MAIL_FROM!,
        to: email,
        subject: 'Reset your password',
        text: `Click this link to reset your password: ${url}\n\nLink valid for 30 minutes.`,
    });
}
