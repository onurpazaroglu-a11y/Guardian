'use client';

import { useAnalysisStore } from '@/stores/analysisStore';
import { BlockerCard } from '@/components/blocker/BlockerCard';
import { SignalCard } from '@/components/signal/SignalCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate, getIntervalLabel, getStrategyLabel, cn } from '@/lib/utils';
import { Activity, Clock, TrendingUp, Shield } from 'lucide-react';

export function AnalysisResult() {
    const analysis = useAnalysisStore((state) => state.currentAnalysis);

    if (!analysis) return null;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-2">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-4xl font-black gradient-text">
                            {analysis.symbol}
                        </h2>
                        <Badge variant="secondary" className="h-6 font-bold bg-primary/20 text-primary border-primary/20">
                            {getIntervalLabel(analysis.interval)}
                        </Badge>
                    </div>
                    <p className="text-muted-foreground font-medium flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        {getStrategyLabel(analysis.strategy)}
                        <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                        <Clock className="h-4 w-4" />
                        {formatDate(analysis.generated_at)}
                    </p>
                </div>
                {analysis.cached && (
                    <Badge variant="secondary" className="vibrant-shimmer border-primary/30">
                        Önbellekten
                    </Badge>
                )}
            </div>

            {/* Core Decision Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <BlockerCard blocker={analysis.blocker} />
                <SignalCard signal={analysis.signal} />
            </div>

            {/* Consistency Deep Dive */}
            <Card className="glass-card border-none ring-1 ring-white/10 shadow-2xl">
                <CardHeader className="border-b border-white/5 pb-6">
                    <CardTitle className="text-lg font-bold flex items-center gap-3 text-white">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <Activity className="h-5 w-5 text-primary" />
                        </div>
                        Piyasa Tutarlılık Analizi
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-8">
                    <div className="space-y-10">
                        {/* Score Visualization */}
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-background/40 p-8 rounded-3xl ring-1 ring-white/5">
                            <div className="text-center md:text-left space-y-1">
                                <div className="text-6xl font-black tracking-tighter text-white">
                                    {analysis.consistency.score}<span className="text-2xl text-muted-foreground">/100</span>
                                </div>
                                <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Consistency Score</p>
                            </div>

                            <div className="h-px md:h-12 w-32 md:w-px bg-white/10" />

                            <div className="text-center md:text-right">
                                <Badge variant="secondary" className={cn(
                                    "text-lg px-6 py-2 rounded-2xl font-black uppercase tracking-wider",
                                    analysis.consistency.score > 60 ? "status-allowed" : "bg-muted text-muted-foreground"
                                )}>
                                    {analysis.consistency.condition}
                                </Badge>
                                <p className="text-xs font-medium text-muted-foreground mt-2">Piyasa Kondisyonu</p>
                            </div>
                        </div>

                        {/* Indicators Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {analysis.consistency.indicator_values.map((indicator) => (
                                <div
                                    key={indicator.name}
                                    className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "w-3 h-3 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]",
                                            indicator.signal === 1 ? "bg-emerald-500 shadow-emerald-500/40" :
                                                indicator.signal === -1 ? "bg-rose-500 shadow-rose-500/40" : "bg-zinc-600"
                                        )} />
                                        <div>
                                            <div className="text-sm font-bold text-white group-hover:text-primary transition-colors">{indicator.name}</div>
                                            <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-tight">
                                                Ağırlık: {(indicator.weight * 100).toFixed(0)}%
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className={cn(
                                            "text-xs font-black p-1.5 rounded-lg px-3",
                                            indicator.confidence > 0.7 ? "bg-emerald-500/10 text-emerald-400" :
                                                indicator.confidence > 0.4 ? "bg-amber-500/10 text-amber-400" : "bg-rose-500/10 text-rose-400"
                                        )}>
                                            %{(indicator.confidence * 100).toFixed(0)} GÜVEN
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}