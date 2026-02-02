'use client';

import { useState } from 'react';
import { useAnalysisStore } from '@/stores/analysisStore';
import { useAuthStore } from '@/stores/authStore';
import { engineApi } from '@/lib/engine';
import { getIntervalLabel, getStrategyLabel, cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Zap, Clock, Shield, Activity } from 'lucide-react';
import { useAnalysis } from '@/hooks/useAnalysis';

export function AnalysisForm() {
    const { analyze, isLoading } = useAnalysis();
    const tier = useAuthStore((state) => state.tier);

    const {
        baseAsset,
        quoteAsset,
        symbol,
        interval,
        strategy,
        setBaseAsset,
        setQuoteAsset,
        setSymbol,
        setInterval,
        setStrategy,
    } = useAnalysisStore();

    const [error, setError] = useState('');

    const intervals = engineApi.getAvailableIntervals(tier);
    const strategies = engineApi.getAvailableStrategies();
    const isPro = tier === 'pro';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            await analyze();
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <Card className="glass-card border-none shadow-2xl overflow-hidden ring-1 ring-white/10">
            <CardContent className="p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Base Asset Input */}
                        <div className="space-y-2.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <Zap className="h-3 w-3 text-primary" />
                                Birinci Birim
                            </label>
                            <Input
                                placeholder="BTC"
                                value={baseAsset}
                                onChange={(e) => setBaseAsset(e.target.value)}
                                className="bg-background/40 border-white/5 h-12 text-base font-mono focus:ring-primary/40 transition-all rounded-xl"
                                disabled={isLoading}
                            />
                        </div>

                        {/* Quote Asset Input */}
                        <div className="space-y-2.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <Activity className="h-3 w-3 text-primary" />
                                İkinci Birim
                            </label>
                            <Input
                                placeholder="USDT"
                                value={quoteAsset}
                                onChange={(e) => setQuoteAsset(e.target.value)}
                                className="bg-background/40 border-white/5 h-12 text-base font-mono focus:ring-primary/40 transition-all rounded-xl"
                                disabled={isLoading}
                            />
                        </div>

                        {/* Interval Select */}
                        <div className="space-y-2.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <Clock className="h-3 w-3 text-primary" />
                                Periyot
                                {!isPro && (
                                    <Badge variant="secondary" className="text-[10px] h-4 font-black">Free</Badge>
                                )}
                            </label>
                            <Select value={interval} onValueChange={setInterval} disabled={isLoading}>
                                <SelectTrigger className="bg-background/40 border-white/5 h-12 rounded-xl">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="glass border-white/10">
                                    {intervals.map((int) => (
                                        <SelectItem key={int} value={int}>
                                            <span className="flex items-center gap-2 font-medium">
                                                {getIntervalLabel(int)}
                                                {!isPro && int !== '4h' && int !== '1d' && (
                                                    <Zap className="h-3 w-3 text-primary fill-primary/20" />
                                                )}
                                            </span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Strategy Select */}
                        <div className="space-y-2.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <Shield className="h-3 w-3 text-primary" />
                                Strateji
                            </label>
                            <Select value={strategy} onValueChange={setStrategy} disabled={isLoading}>
                                <SelectTrigger className="bg-background/40 border-white/5 h-12 rounded-xl">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="glass border-white/10">
                                    {strategies.map((strat) => (
                                        <SelectItem key={strat.value} value={strat.value}>
                                            <div className="py-1">
                                                <div className="font-semibold">{strat.label}</div>
                                                <div className="text-[10px] text-muted-foreground leading-tight">{strat.desc}</div>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {error && (
                        <div className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl flex items-center gap-3 animate-in fade-in zoom-in-95">
                            <Shield className="h-4 w-4 shrink-0" />
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full h-14 text-base font-bold rounded-2xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                        disabled={isLoading || !symbol}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                                Analiz Motoru Çalışıyor...
                            </>
                        ) : (
                            <>
                                <Zap className="mr-2 h-5 w-5 fill-current" />
                                Analiz Et
                            </>
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}