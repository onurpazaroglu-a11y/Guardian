'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { UpgradePrompt } from '@/components/shared/UpgradePrompt';
import { useAnalysisStore } from '@/stores/analysisStore';
import { Activity, History as HistoryIcon, Shield, Zap, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
    const { isPro, user } = useAuth();
    const recentAnalyses = useAnalysisStore((state) => state.recentAnalyses);

    return (
        <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-500 pb-10">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter gradient-text">
                        Hoş geldin, {user?.email?.split('@')[0]}
                    </h1>
                    <p className="text-lg text-muted-foreground font-medium max-w-xl">
                        Guardian karar destek sistemi ile piyasaları taramaya başlayın ve yapay zeka destekli sinyaller alın.
                    </p>
                </div>
                <Link href="/dashboard/analysis">
                    <Button className="h-14 px-8 text-lg font-bold rounded-2xl shadow-xl shadow-primary/20 bg-gradient-to-r from-primary to-violet-600 hover:scale-105 transition-all">
                        <Zap className="mr-2 h-5 w-5 fill-current" />
                        Hızlı Analiz Başlat
                    </Button>
                </Link>
            </div>

            {!isPro && <UpgradePrompt />}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass-card border-none ring-1 ring-white/10 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-blue-500/20 transition-all" />

                    <CardHeader>
                        <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 ring-1 ring-blue-500/20">
                            <Activity className="h-6 w-6 text-blue-500" />
                        </div>
                        <CardTitle className="text-xl font-bold">Analiz Yap</CardTitle>
                        <CardDescription className="text-base">Borsa verilerini teknik olarak analiz edin ve sinyal üretin.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center text-sm font-bold text-blue-500 mt-2">
                            Analize Git <ChevronRight className="h-4 w-4 ml-1" />
                        </div>
                        <Link href="/dashboard/analysis" className="absolute inset-0" />
                    </CardContent>
                </Card>

                <Card className="glass-card border-none ring-1 ring-white/10 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-emerald-500/20 transition-all" />

                    <CardHeader>
                        <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 ring-1 ring-emerald-500/20">
                            <HistoryIcon className="h-6 w-6 text-emerald-500" />
                        </div>
                        <CardTitle className="text-xl font-bold">Geçmiş Analizler</CardTitle>
                        <CardDescription className="text-base">Toplam {recentAnalyses.length} kayıtlı analiziniz var.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center text-sm font-bold text-emerald-500 mt-2">
                            Geçmişi Görüntüle <ChevronRight className="h-4 w-4 ml-1" />
                        </div>
                        <Link href="/dashboard/history" className="absolute inset-0" />
                    </CardContent>
                </Card>

                <Card className="glass-card border-none ring-1 ring-white/10 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-purple-500/20 transition-all" />

                    <CardHeader>
                        <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 ring-1 ring-purple-500/20">
                            <Shield className="h-6 w-6 text-purple-500" />
                        </div>
                        <CardTitle className="text-xl font-bold">Hesap Ayarları</CardTitle>
                        <CardDescription className="text-base">API anahtarları ve abonelik yönetimi.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center text-sm font-bold text-purple-500 mt-2">
                            Ayarları Yapılandır <ChevronRight className="h-4 w-4 ml-1" />
                        </div>
                        <Link href="/dashboard/settings" className="absolute inset-0" />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}