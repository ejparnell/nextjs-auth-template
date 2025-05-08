import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'Auth Template',
    description:
        'A simple authentication template using Next.js and NextAuth.js',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en'>
            <body>{children}</body>
        </html>
    );
}
