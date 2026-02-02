'use client';

import { SignalOutput } from '@/types/engine';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, Target, Zap } from 'lucide-react';
import { cn, formatNumber } from '@/lib/utils';
import { EntryZones } from './EntryZones';
import { SignalStrength } from './SignalStrength';

interface SignalCardProps {
    signal: SignalOutput;
}

export function SignalCard({ signal }: SignalCardProps) {
    const isUp = signal.direction === 'UP';
    const isNeutral = signal.direction === 'NEUTRAL';

    return (
        <Card className={cn(
            "glass-card border-none ring-1 transition-all duration-500 overflow-hidden group shadow-2xl",
            isUp ? "ring-emerald-500/30" : isNeutral ? "ring-zinc-500/30" : "ring-rose-500/30"
        )}>
            {/* Visual Flare */}
            <div className={cn(
                "absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full blur-3xl opacity-20 transition-colors duration-1000",
                isUp ? "bg-emerald-500" : isNeutral ? "bg-zinc-500" : "bg-rose-500"
            )} />

            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 relative">
                <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Analiz Sinyali</CardTitle>
                <div className={cn(
                    "p-2 rounded-xl transition-all duration-500",
                    isUp ? "bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20" :
                        isNeutral ? "bg-zinc-500/10 text-zinc-400 group-hover:bg-zinc-500/20" :
                            "bg-rose-500/10 text-rose-400 group-hover:bg-rose-500/20"
                )}>
                    {isUp ? (
                        <TrendingUp className="h-5 w-5" />
                    ) : isNeutral ? (
                        <Minus className="h-5 w-5" />
                    ) : (
                        <TrendingDown className="h-5 w-5" />
                    )}
                </div>
            </CardHeader>
            <CardContent className="relative space-y-8">
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <div className={cn(
                            "text-5xl font-black tracking-tighter transition-all duration-700",
                            isUp ? "text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]" :
                                isNeutral ? "text-zinc-400" :
                                    "text-rose-400 drop-shadow-[0_0_15px_rgba(244,63,94,0.3)]"
                        )}>
                            {isUp ? 'YUKARI' : isNeutral ? 'NÖTR' : 'AŞAĞI'}
                        </div>
                        <SignalStrength strength={signal.strength} />
                    </div>
                    <div className="bg-background/40 p-5 rounded-3xl ring-1 ring-white/10 text-center min-w-[100px] backdrop-blur-sm">
                        <div className="text-4xl font-black text-white">{signal.trend_score}</div>
                        <p className="text-[10px] font-bold text-muted-foreground mt-1 uppercase tracking-tighter">Trend Skoru</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    <EntryZones zones={signal.entry_zones} />

                    {(signal.stop_loss || signal.take_profit) && (
                        <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 ring-1 ring-white/5">
                            <div className="space-y-1">
                                <div className="text-[10px] font-black text-rose-500/80 uppercase tracking-widest flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_5px_rgba(244,63,94,0.5)]" />
                                    Stop Loss
                                </div>
                                <div className="text-xl font-black text-white font-mono tracking-tight">
                                    {signal.stop_loss ? formatNumber(signal.stop_loss) : '-'}
                                </div>
                            </div>
                            <div className="space-y-1 text-right">
                                <div className="text-[10px] font-black text-emerald-500/80 uppercase tracking-widest flex items-center gap-1.5 justify-end">
                                    Take Profit
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
                                </div>
                                <div className="text-xl font-black text-white font-mono tracking-tight">
                                    {signal.take_profit ? formatNumber(signal.take_profit) : '-'}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}