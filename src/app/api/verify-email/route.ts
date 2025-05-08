import { dbConnect } from '@/lib/dbConnect';
import { User } from '@/models/User';
import { VerificationToken } from '@/models/VerificationToken';
import { NextResponse, type NextRequest } from 'next/server';
import crypto from 'crypto';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    if (!token || !email) {
        return NextResponse.redirect('/signin?error=InvalidLink');
    }

    await dbConnect();

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const record = await VerificationToken.findOne({ tokenHash }).lean();

    if (!record || record.expiresAt < new Date()) {
        return NextResponse.redirect('/signin?error=LinkExpired');
    }

    const user = await User.findById(record.userId);
    if (!user || user.email !== email) {
        return NextResponse.redirect('/signin?error=InvalidLink');
    }

    user.emailVerified = new Date();
    await user.save();
    await VerificationToken.deleteOne({ _id: record._id });

    const redirectUrl = new URL('/signin?verified=1', req.nextUrl.origin);
    return NextResponse.redirect(redirectUrl);
}
