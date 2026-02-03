"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Activity, BarChart3, Zap } from "lucide-react";

export default function SignalPage() {
    // Mock data - will be replaced with real API calls
    const consistencyScore = 78;
    const activeSignals = 5;
    const winRate = 68;

    return (
        <div className="container mx-auto p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center ring-1 ring-green-500/20">
                        <TrendingUp className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight gradient-text">Signal</h1>
                        <p className="text-muted-foreground">Yapay zeka destekli alım-satım sinyalleri</p>
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-green-500/20">
                    <CardHeader className="pb-3">
                        <CardDescription>Aktif Sinyal</CardDescription>
                        <CardTitle className="text-3xl font-black text-green-500">{activeSignals}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Zap className="h-4 w-4" />
                            Şu anda aktif
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-blue-500/20">
                    <CardHeader className="pb-3">
                        <CardDescription>Başarı Oranı</CardDescription>
                        <CardTitle className="text-3xl font-black text-blue-500">{winRate}%</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Activity className="h-4 w-4" />
                            Son 30 gün
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-purple-500/20">
                    <CardHeader className="pb-3">
                        <CardDescription>Tutarlılık Skoru</CardDescription>
                        <CardTitle className="text-3xl font-black text-purple-500">{consistencyScore}%</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <BarChart3 className="h-4 w-4" />
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

            {/* Signal Specific: Active Signals */}
            <Card className="border-green-500/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-green-500" />
                        Aktif Sinyaller
                    </CardTitle>
                    <CardDescription>Yapay zeka tarafından üretilen alım-satım önerileri</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {[
                            {
                                pair: 'BTC/USDT',
                                type: 'BUY',
                                price: '43,250',
                                target: '44,800',
                                stop: '42,100',
                                confidence: 85,
                                time: '5 dakika önce'
                            },
                            {
                                pair: 'ETH/USDT',
                                type: 'SELL',
                                price: '2,280',
                                target: '2,180',
                                stop: '2,350',
                                confidence: 72,
                                time: '12 dakika önce'
                            },
                            {
                                pair: 'SOL/USDT',
                                type: 'BUY',
                                price: '98.50',
                                target: '102.00',
                                stop: '96.20',
                                confidence: 78,
                                time: '25 dakika önce'
                            },
                        ].map((signal, idx) => (
                            <div key={idx} className="p-4 rounded-lg bg-muted/20 border border-white/5 space-y-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        {signal.type === 'BUY' ? (
                                            <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center ring-1 ring-green-500/20">
                                                <TrendingUp className="h-5 w-5 text-green-500" />
                                            </div>
                                        ) : (
                                            <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center ring-1 ring-red-500/20">
                                                <TrendingDown className="h-5 w-5 text-red-500" />
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-bold">{signal.pair}</p>
                                            <p className="text-xs text-muted-foreground">{signal.time}</p>
                                        </div>
                                    </div>
                                    <Badge variant={signal.type === 'BUY' ? 'default' : 'destructive'} className="font-bold">
                                        {signal.type}
                                    </Badge>
                                </div>
                                <div className="grid grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <p className="text-muted-foreground text-xs">Giriş</p>
                                        <p className="font-bold">${signal.price}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground text-xs">Hedef</p>
                                        <p className="font-bold text-green-500">${signal.target}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground text-xs">Stop</p>
                                        <p className="font-bold text-red-500">${signal.stop}</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                                    <div className="flex items-center gap-2">
                                        <Activity className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-xs text-muted-foreground">Güven: {signal.confidence}%</span>
                                    </div>
                                    <Button size="sm" variant="outline" className="h-8">
                                        Detaylar
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
