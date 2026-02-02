'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Shield, LogOut, Bell, Menu, X, LayoutDashboard, Activity, History, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

export function Header() {
    const { user, signOut } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    const routes = [
        { label: 'Genel Bakış', icon: LayoutDashboard, href: '/dashboard' },
        { label: 'Analiz Terminali', icon: Activity, href: '/dashboard/analysis' },
        { label: 'İşlem Geçmişi', icon: History, href: '/dashboard/history' },
        { label: 'Ayarlar', icon: Settings, href: '/dashboard/settings' },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/40">
            <div className="container flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-4">
                    {/* Mobile Menu Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden text-muted-foreground hover:text-primary"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </Button>

                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center shadow-lg shadow-primary/25 group-hover:scale-105 transition-transform duration-300">
                            <Shield className="h-5 w-5 text-white transform -rotate-12" />
                        </div>
                        <span className="font-black text-xl tracking-tighter gradient-text hidden sm:inline-block">GUARDIAN</span>
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="relative group">
                        <Bell className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_currentColor]" />
                    </Button>

                    <div className="h-8 w-px bg-white/10 mx-2 hidden sm:block" />

                    <div className="flex items-center gap-3">
                        <div className="flex flex-col items-end hidden sm:flex">
                            <span className="text-sm font-bold leading-none">{user?.email?.split('@')[0]}</span>
                            <span className="text-[10px] uppercase text-primary font-black tracking-widest leading-none mt-1.5 opacity-80">
                                {user?.tier} PLAN
                            </span>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => signOut()}
                            className="bg-white/5 hover:bg-rose-500/10 hover:text-rose-500 rounded-xl"
                            title="Çıkış Yap"
                        >
                            <LogOut className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Overlay */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-16 left-0 right-0 bg-background/95 backdrop-blur-2xl border-b border-white/10 shadow-2xl animate-in slide-in-from-top-4">
                    <div className="p-4 space-y-2">
                        {routes.map((route) => (
                            <Link
                                key={route.href}
                                href={route.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium",
                                    pathname === route.href
                                        ? "bg-primary/10 text-primary"
                                        : "hover:bg-white/5 text-muted-foreground"
                                )}
                            >
                                <route.icon className="h-5 w-5" />
                                {route.label}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </header>
    );
}
