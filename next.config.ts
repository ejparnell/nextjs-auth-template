const isDev = process.env.NODE_ENV === 'development';

function scriptSrc() {
    if (isDev) {
        return "'self' 'unsafe-inline' 'unsafe-eval'";
    }
    return [
        "'self'",
        "'sha256-LcsuUMiDkprrt6ZKeiLP4iYNhWo8NqaSbAgtoZxVK3s='",
    ].join(' ');
}

const nextConfig = {
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-DNS-Prefetch-Control',
                        value: 'off',
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                    {
                        key: 'Permissions-Policy',
                        value:
                            'camera=(), microphone=(), geolocation=(), ' +
                            'clipboard-read=(self), clipboard-write=(self)',
                    },
                    {
                        key: 'Strict-Transport-Security',
                        value: 'max-age=15552000; includeSubDomains; preload',
                    },
                    {
                        key: 'Content-Security-Policy',
                        value: [
                            "default-src 'self'",
                            "img-src 'self' https: data: blob:",
                            'frame-src https://challenges.cloudflare.com',
                            `script-src ${scriptSrc()} https://challenges.cloudflare.com`,
                            "style-src 'self' 'unsafe-inline' https://challenges.cloudflare.com",
                        ].join('; '),
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
