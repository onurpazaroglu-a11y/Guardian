import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AuthInitializer } from '@/components/auth/AuthInitializer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Guardian - Trading Decision Support',
    description: 'Manuel trader\'lar için karar destek sistemi',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="tr" suppressHydrationWarning>
            <body className={inter.className}>
                <AuthInitializer>
                    {children}
                </AuthInitializer>
                <Toaster />
            </body>
        </html>
    );
}