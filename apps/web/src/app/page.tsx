'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Shield, TrendingUp, Zap, BarChart3, User as UserIcon } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

export default function LandingPage() {
    const { user, signOut } = useAuthStore();

    return (
        <div className="flex flex-col min-h-screen bg-background">
            {/* Header */}
            <header className="px-4 lg:px-6 h-16 flex items-center border-b">
                <Link className="flex items-center justify-center italic" href="#">
                    <Shield className="h-6 w-6 mr-2 text-primary" />
                    <span className="font-bold text-xl tracking-tight">GUARDIAN</span>
                </Link>
                <nav className="ml-auto flex items-center gap-4 sm:gap-6">
                    <Link className="text-sm font-medium hover:underline underline-offset-4" href="#features">
                        Özellikler
                    </Link>
                    {user ? (
                        <div className="flex items-center gap-4">
                            <Link className="text-sm font-medium hover:underline underline-offset-4" href="/dashboard">
                                Dashboard
                            </Link>
                            <Button variant="ghost" size="sm" onClick={() => signOut()}>
                                Çıkış Yap
                            </Button>
                        </div>
                    ) : (
                        <Link className="text-sm font-medium hover:underline underline-offset-4" href="/login">
                            Giriş Yap
                        </Link>
                    )}
                </nav>
            </header>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-background to-muted/50">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                                    Trade Kararlarınızı <span className="text-primary">Guardian</span> ile Koruyun
                                </h1>
                                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                                    Manuel traderlar için geliştirilmiş gelişmiş karar destek sistemi. FOMO ve hatalı işlemleri minimuma indirin.
                                </p>
                            </div>
                            <div className="space-x-4">
                                <Link href={user ? "/dashboard" : "/login"}>
                                    <Button size="lg" className="px-8">
                                        {user ? "Dashboard'a Git" : "Hemen Başla"}
                                    </Button>
                                </Link>
                                <Link href="#features">
                                    <Button variant="outline" size="lg">Daha Fazla Bilgi</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-background">
                    <div className="container px-4 md:px-6">
                        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="flex flex-col items-center space-y-3 text-center p-6 rounded-xl border bg-card shadow-sm transition-all hover:shadow-md">
                                <div className="p-3 rounded-full bg-primary/10">
                                    <BarChart3 className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold">Tutarlılık Puanı</h3>
                                <p className="text-muted-foreground">Birden fazla teknik indikatörün uyumunu 0-100 arası skorla anlık takip edin.</p>
                            </div>
                            <div className="flex flex-col items-center space-y-3 text-center p-6 rounded-xl border bg-card shadow-sm transition-all hover:shadow-md">
                                <div className="p-3 rounded-full bg-primary/10">
                                    <Shield className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold">Guardian Blocker</h3>
                                <p className="text-muted-foreground">Piyasa sinyalleri tutarsız olduğunda sizi uyarır ve riskli işlemlerden korur.</p>
                            </div>
                            <div className="flex flex-col items-center space-y-3 text-center p-6 rounded-xl border bg-card shadow-sm transition-all hover:shadow-md">
                                <div className="p-3 rounded-full bg-primary/10">
                                    <Zap className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold">Akıllı Sinyaller</h3>
                                <p className="text-muted-foreground">Breakout ve Pullback stratejileri için optimize edilmiş giriş ve çıkış bölgeleri.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t font-light text-xs opacity-60">
                <p>© 2026 Guardian AI Engine. Tüm hakları saklıdır.</p>
                <nav className="sm:ml-auto flex gap-4 sm:gap-6">
                    <Link className="hover:underline underline-offset-4" href="#">Kullanım Şartları</Link>
                    <Link className="hover:underline underline-offset-4" href="#">Gizlilik</Link>
                </nav>
            </footer>
        </div>
    );
}
