'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Activity,
    History,
    Settings,
    Zap,
    Shield
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

const routes = [
    {
        label: 'Genel Bakış',
        icon: LayoutDashboard,
        href: '/dashboard',
    },
    {
        label: 'Analiz Terminali',
        icon: Activity,
        href: '/dashboard/analysis',
    },
    {
        label: 'İşlem Geçmişi',
        icon: History,
        href: '/dashboard/history',
    },
    {
        label: 'Ayarlar',
        icon: Settings,
        href: '/dashboard/settings',
    },
];

export function Sidebar() {
    const pathname = usePathname();
    const { isPro } = useAuth();

    return (
        <div className="flex flex-col h-full py-6 space-y-6 glass border-r bg-background/20">
            <div className="px-6">
                <Link href="/dashboard" className="flex items-center gap-3 group">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center shadow-lg shadow-primary/25 group-hover:scale-105 transition-transform duration-300">
                        <Shield className="h-6 w-6 text-white transform -rotate-12" />
                    </div>
                    <div>
                        <span className="font-black text-xl tracking-tighter gradient-text">GUARDIAN</span>
                        <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest -mt-1">
                            Intelligence
                        </div>
                    </div>
                </Link>
            </div>

            <div className="flex-1 px-4 space-y-2">
                <div className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest px-4 mb-2">
                    Menü
                </div>
                {routes.map((route) => (
                    <Link
                        key={route.href}
                        href={route.href}
                        className={cn(
                            'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 group relative overflow-hidden',
                            pathname === route.href
                                ? 'bg-primary/10 text-primary shadow-[0_0_20px_rgba(var(--primary),0.1)]'
                                : 'text-muted-foreground hover:bg-white/5 hover:text-white'
                        )}
                    >
                        {pathname === route.href && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full shadow-[0_0_10px_currentColor]" />
                        )}
                        <route.icon className={cn(
                            "h-5 w-5 transition-transform duration-300 group-hover:scale-110",
                            pathname === route.href ? "text-primary fill-primary/20" : "text-muted-foreground"
                        )} />
                        {route.label}

                        {pathname === route.href && (
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent -z-10" />
                        )}
                    </Link>
                ))}
            </div>

            {!isPro && (
                <div className="px-4">
                    <div className="relative rounded-2xl overflow-hidden p-5 group">
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-primary/20 to-fuchsia-600/20 border border-white/5" />
                        <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/30 blur-3xl rounded-full" />

                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-2">
                                <Zap className="h-5 w-5 text-amber-400 fill-amber-400 animate-pulse" />
                                <span className="font-bold text-white">PRO Plan</span>
                            </div>
                            <p className="text-xs text-muted-foreground/80 mb-4 leading-relaxed">
                                Gerçek zamanlı veri, limitsiz analiz ve yapay zeka desteği.
                            </p>
                            <Button size="sm" className="w-full rounded-xl font-bold bg-gradient-to-r from-primary to-violet-600 border-0 shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] transition-all">
                                Yükselt
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}