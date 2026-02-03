"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Shield, Zap, Star } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function AccountPage() {
    const { user } = useAuth();

    // Mapping plan types to UI props
    const plansInfo = {
        FREE: { icon: Shield, color: "text-gray-400", bg: "bg-gray-400/10" },
        SIGNAL: { icon: Zap, color: "text-yellow-400", bg: "bg-yellow-400/10" },
        BLOCKER: { icon: Crown, color: "text-purple-400", bg: "bg-purple-400/10" },
        BUNDLE: { icon: Star, color: "text-primary", bg: "bg-primary/10" }
    };

    const currentPlan = user?.tier || 'FREE';
    const PlanIcon = plansInfo[currentPlan as keyof typeof plansInfo]?.icon || Shield;

    return (
        <div className="container mx-auto p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black tracking-tight gradient-text w-fit">Hesap Durumu</h1>
                <p className="text-muted-foreground">Mevcut abonelik planınız ve özellikleriniz.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Active Plan Card */}
                <Card className="relative overflow-hidden border-primary/50 shadow-2xl shadow-primary/10">
                    <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-3 py-1">
                                AKTİF PLAN
                            </Badge>
                            <span className="text-sm text-muted-foreground">Yenileme: 12.03.2026</span>
                        </div>
                        <div className="pt-6">
                            <h2 className="text-4xl font-black tracking-tighter flex items-center gap-3">
                                <PlanIcon className={`h-8 w-8 ${plansInfo[currentPlan as keyof typeof plansInfo]?.color}`} />
                                {currentPlan}
                            </h2>
                            <p className="text-muted-foreground mt-2">
                                Kurumsal seviye analiz ve koruma paketi.
                            </p>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-3">
                            {[
                                "Tüm Piyasalar (Kripto, FX, BIST)",
                                "Sınırsız AI Analizi",
                                "7/24 Koruma Kalkanı",
                                "Anlık Sinyal Bildirimleri",
                                "Öncelikli Destek"
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="h-6 w-6 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                                        <Check className="h-3.5 w-3.5 text-green-500" />
                                    </div>
                                    <span className="text-sm">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full bg-background/50 hover:bg-background/80 border border-white/10" variant="outline">
                            Planı Yönet
                        </Button>
                    </CardFooter>
                </Card>

                {/* Account Details / Stats */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Hesap Limitleri</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Günlük Analiz Hakkı</span>
                                    <span className="text-muted-foreground">450 / 500</span>
                                </div>
                                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                    <div className="h-full bg-primary w-[90%] rounded-full" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>API İstekleri</span>
                                    <span className="text-muted-foreground">12,450 / 20,000</span>
                                </div>
                                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 w-[62%] rounded-full" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-0">
                        <CardHeader>
                            <CardTitle>Bundle Pakete Yükselt</CardTitle>
                            <CardDescription className="text-white/80">
                                Tüm Guardian araçlarına sınırsız erişim kazanın.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold mb-1">₺899<span className="text-sm font-normal text-white/70">/ay</span></div>
                        </CardContent>
                        <CardFooter>
                            <Button variant="secondary" className="w-full text-indigo-900 font-bold hover:bg-white/90">
                                Yükselt
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
