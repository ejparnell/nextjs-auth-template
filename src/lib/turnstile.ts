export async function verifyTurnstile(token: string, ip: string) {
    const res = await fetch(
        'https://challenges.cloudflare.com/turnstile/v0/siteverify',
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                secret: process.env.TURNSTILE_SECRET!,
                response: token,
                remoteip: ip,
            }),
        }
    );
    const data = (await res.json()) as { success: boolean };
    if (!data.success) {
        throw new Response(JSON.stringify({ error: 'Captcha failed' }), {
            status: 400,
        });
    }
}
