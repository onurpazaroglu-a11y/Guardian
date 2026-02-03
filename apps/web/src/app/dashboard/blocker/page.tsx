"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, AlertTriangle, CheckCircle2, TrendingDown, Activity, BarChart3 } from "lucide-react";

export default function BlockerPage() {
    // Mock data - will be replaced with real API calls
    const consistencyScore = 78;
    const riskLevel = "Orta";
    const blockedSignals = 3;

    return (
        <div className="container mx-auto p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-red-500/10 flex items-center justify-center ring-1 ring-red-500/20">
                        <ShieldAlert className="h-6 w-6 text-red-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight gradient-text">Blocker</h1>
                        <p className="text-muted-foreground">Risk analizi ve koruma sistemi</p>
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-red-500/20">
                    <CardHeader className="pb-3">
                        <CardDescription>Risk Seviyesi</CardDescription>
                        <CardTitle className="text-3xl font-black text-red-500">{riskLevel}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <AlertTriangle className="h-4 w-4" />
                            Dikkatli olun
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-amber-500/20">
                    <CardHeader className="pb-3">
                        <CardDescription>Engellenen Sinyal</CardDescription>
                        <CardTitle className="text-3xl font-black text-amber-500">{blockedSignals}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <TrendingDown className="h-4 w-4" />
                            Son 24 saat
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-blue-500/20">
                    <CardHeader className="pb-3">
                        <CardDescription>Tutarlılık Skoru</CardDescription>
                        <CardTitle className="text-3xl font-black text-blue-500">{consistencyScore}%</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Activity className="h-4 w-4" />
                            Piyasa analizi
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Market Consistency Analysis - Shared Component */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-primary" />
                        <CardTitle>Piyasa Tutarlılık Analizi</CardTitle>
                    </div>
                    <CardDescription>
                        Seçilen paritenin farklı zaman dilimlerindeki tutarlılık durumu
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[
                            { timeframe: '1 Dakika', consistency: 85, status: 'good' },
                            { timeframe: '5 Dakika', consistency: 78, status: 'good' },
                            { timeframe: '15 Dakika', consistency: 92, status: 'excellent' },
                            { timeframe: '1 Saat', consistency: 65, status: 'warning' },
                            { timeframe: '4 Saat', consistency: 45, status: 'danger' },
                            { timeframe: '1 Gün', consistency: 88, status: 'excellent' },
                        ].map((item) => (
                            <div key={item.timeframe} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                                <div className="flex items-center gap-4">
                                    <div className="w-24 text-sm font-medium">{item.timeframe}</div>
                                    <div className="flex-1">
                                        <div className="h-2 w-64 bg-muted rounded-full overflow-hidden">
                                            <div
                                                className={`h-full transition-all ${item.status === 'excellent' ? 'bg-green-500' :
                                                        item.status === 'good' ? 'bg-blue-500' :
                                                            item.status === 'warning' ? 'bg-amber-500' :
                                                                'bg-red-500'
                                                    }`}
                                                style={{ width: `${item.consistency}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-bold">{item.consistency}%</span>
                                    {item.status === 'excellent' || item.status === 'good' ? (
                                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                                    ) : (
                                        <AlertTriangle className={`h-5 w-5 ${item.status === 'warning' ? 'text-amber-500' : 'text-red-500'}`} />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Blocker Specific: Risk Alerts */}
            <Card className="border-red-500/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ShieldAlert className="h-5 w-5 text-red-500" />
                        Risk Uyarıları
                    </CardTitle>
                    <CardDescription>Sistem tarafından tespit edilen riskli durumlar</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {[
                            { type: 'high', message: 'Yüksek volatilite tespit edildi', time: '2 dakika önce' },
                            { type: 'medium', message: 'Düşük likidite uyarısı', time: '15 dakika önce' },
                            { type: 'medium', message: 'Trend tutarsızlığı', time: '1 saat önce' },
                        ].map((alert, idx) => (
                            <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-muted/20 border border-white/5">
                                <AlertTriangle className={`h-5 w-5 mt-0.5 ${alert.type === 'high' ? 'text-red-500' : 'text-amber-500'
                                    }`} />
                                <div className="flex-1">
                                    <p className="text-sm font-medium">{alert.message}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                                </div>
                                <Badge variant={alert.type === 'high' ? 'destructive' : 'outline'}>
                                    {alert.type === 'high' ? 'Yüksek' : 'Orta'}
                                </Badge>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
