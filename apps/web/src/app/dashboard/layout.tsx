'use client';

import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Temporarily disabled for testing
        /*
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
        */
    }, [isLoading, isAuthenticated, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/20 animate-bounce" />
                    <span className="text-sm text-muted-foreground">Yükleniyor...</span>
                </div>
            </div>
        );
    }

    // if (!isAuthenticated) return null;

    return (
        <div className="min-h-screen">
            <Header />
            <div className="flex pt-16">
                <aside className="hidden md:block w-72 fixed left-0 top-16 bottom-0 z-30">
                    <Sidebar />
                </aside>
                <main className="flex-1 p-6 md:p-8 md:ml-72 min-h-[calc(100vh-4rem)]">
                    {children}
                </main>
            </div>
        </div>
    );
}