import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function GET() {
    const resend = new Resend(process.env.RESEND_API_KEY!);
    try {
        const data = await resend.emails.send({
            from: 'Sandbox <onboarding@eparnell.me>',
            to: 'elizabethprnll@gmail.com',
            subject: 'Ping from template',
            text: 'Hello world',
        });
        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error('Resend error', err);
        return NextResponse.json({ error: String(err) }, { status: 500 });
    }
}
