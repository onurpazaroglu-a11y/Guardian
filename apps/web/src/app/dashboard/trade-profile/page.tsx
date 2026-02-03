"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, Clock, TrendingUp, Zap, BarChart3, AlertCircle } from "lucide-react";

export default function TradeProfilePage() {
    // Mock data based on user request logic
    const tradeProfile = {
        type: "Day Trader",
        avgTimeframe: "15 Dakika",
        riskScore: "Orta",
        winRate: "%68",
        recommendations: [
            "15 dakikalık grafiklerde RSI uyumsuzluklarına dikkat etmelisin.",
            "Volatilite yüksek olduğunda stop-loss seviyelerini genişlet.",
            "London ve NY seans açılışlarında işlem yoğunluğunu artır."
        ]
    };

    return (
        <div className="container mx-auto p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black tracking-tight gradient-text w-fit">Trade Profili Analizi</h1>
                <p className="text-muted-foreground">İşlem alışkanlıklarınıza göre oluşturulan yapay zeka destekli analizler.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Trader Tipi</CardTitle>
                        <Zap className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{tradeProfile.type}</div>
                        <p className="text-xs text-muted-foreground">İşlem sıklığına göre belirlendi</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Favori Zaman Aralığı</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{tradeProfile.avgTimeframe}</div>
                        <p className="text-xs text-muted-foreground">Ortalama işlem süresi baz alındı</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Başarı Oranı</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">{tradeProfile.winRate}</div>
                        <p className="text-xs text-muted-foreground">Son 30 gün performansı</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Risk İştahı</CardTitle>
                        <Activity className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-500">{tradeProfile.riskScore}</div>
                        <p className="text-xs text-muted-foreground">Kaldıraç kullanımına göre</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-8 md:grid-cols-[2fr_1fr]">
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-primary" />
                            Zaman Aralığı Analizi
                        </CardTitle>
                        <CardDescription>
                            İşlem türünüze göre takip etmeniz gereken kritik seviyeler.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium">Scalp (1-5 dk)</span>
                                    <span className="text-muted-foreground">%65 Uygunluk</span>
                                </div>
                                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                    <div className="h-full bg-primary w-[65%] rounded-full" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium">Day Trade (15-60 dk)</span>
                                    <span className="text-primary font-bold">%92 Uygunluk</span>
                                </div>
                                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                    <div className="h-full bg-primary w-[92%] rounded-full shadow-[0_0_10px_currentColor] text-primary" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium">Swing (4h-1d)</span>
                                    <span className="text-muted-foreground">%40 Uygunluk</span>
                                </div>
                                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                    <div className="h-full bg-primary w-[40%] rounded-full" />
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 p-4 bg-primary/5 rounded-xl border border-primary/10">
                            <h4 className="font-semibold text-primary mb-2">Yapay Zeka Görüşü</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Mevcut işlem geçmişiniz incelendiğinde, <strong>15 dakikalık</strong> grafiklerdeki formasyonları tespit etme başarınız, diğer zaman dilimlerine göre %27 daha yüksek. Stratejinizi bu zaman dilimine odaklayarak karlılığınızı artırabilirsiniz.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-b from-blue-500/5 to-purple-500/5 border-0 shadow-xl ring-1 ring-white/10">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-blue-400" />
                            Öneriler
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {tradeProfile.recommendations.map((rec, i) => (
                                <div key={i} className="flex gap-3 items-start p-3 rounded-lg bg-background/50 border border-white/5 hover:border-white/10 transition-colors">
                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-[10px] font-bold text-blue-500">
                                        {i + 1}
                                    </span>
                                    <p className="text-sm text-muted-foreground">{rec}</p>
                                </div>
                            ))}
                        </div>
                        <Button className="w-full mt-6 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700">
                            Detaylı Rapor Oluştur
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
