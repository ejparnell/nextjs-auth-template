import { Resend } from 'resend';
import crypto from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY as string);
const MAIL_FROM = process.env.MAIL_FROM as string;

export async function createAndSendVerification(userId: string, email: string) {
    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const { VerificationToken } = await import('@/models/VerificationToken');
    await new VerificationToken({
        userId,
        tokenHash,
        kind: 'email',
        expiresAt: new Date(Date.now() + 15 * 60 * 1_000),
    }).save();

    const verifyUrl = `${
        process.env.NEXTAUTH_URL
    }/api/verify-email?token=${token}&email=${encodeURIComponent(email)}`;

    await resend.emails.send({
        from: MAIL_FROM,
        to: email,
        subject: 'Verify your email',
        text: `Click the link to verify: ${verifyUrl}`,
    });
}
