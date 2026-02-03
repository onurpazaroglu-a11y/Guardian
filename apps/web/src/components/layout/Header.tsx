'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Shield, LogOut, Bell, Menu, X, LayoutDashboard, Activity, History, Settings, User, Wallet, LineChart, FileText, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="bg-white/5 hover:bg-white/10 rounded-xl">
                                <User className="h-5 w-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{user?.email?.split('@')[0]}</p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        {user?.tier} PLAN
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href="/dashboard/profile" className="flex items-center cursor-pointer">
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Profil</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/dashboard/account" className="flex items-center cursor-pointer">
                                    <Wallet className="mr-2 h-4 w-4" />
                                    <span>Aktif Account Bilgisi</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/dashboard/trade-profile" className="flex items-center cursor-pointer">
                                    <LineChart className="mr-2 h-4 w-4" />
                                    <span>Trade Profil Bilgisi</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/dashboard/logs" className="flex items-center cursor-pointer">
                                    <FileText className="mr-2 h-4 w-4" />
                                    <span>Loglar</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/dashboard/orders" className="flex items-center cursor-pointer">
                                    <ShoppingBag className="mr-2 h-4 w-4" />
                                    <span>Alışveriş Geçmişi</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => signOut()} className="text-red-500 focus:text-red-500">
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Çıkış Yap</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
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
