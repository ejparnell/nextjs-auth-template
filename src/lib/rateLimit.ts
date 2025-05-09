import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

const redis = Redis.fromEnv();

export const rl = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '1 h'),
    analytics: true,
});

export async function limit(ip: string) {
    const { success, remaining, reset } = await rl.limit(ip);
    if (!success) {
        throw new Response(
            JSON.stringify({ error: 'Too many requests', reset }),
            { status: 429 }
        );
    }
    return remaining;
}
