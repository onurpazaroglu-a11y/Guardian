'use client';

import { BlockerOutput } from '@/types/engine';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, ShieldAlert, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BlockerCardProps {
    blocker: BlockerOutput;
}

export function BlockerCard({ blocker }: BlockerCardProps) {
    const isAllowed = blocker.decision === 'ALLOWED';

    return (
        <Card className={cn(
            'glass-card border-none ring-1 transition-all duration-500 overflow-hidden group',
            isAllowed ? 'ring-emerald-500/30' : 'ring-rose-500/30'
        )}>
            <div className={cn(
                "absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full blur-3xl opacity-20 transition-colors duration-1000",
                isAllowed ? "bg-emerald-500" : "bg-rose-500"
            )} />

            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 relative">
                <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Blocker Kararı</CardTitle>
                <div className={cn(
                    "p-2 rounded-xl transition-all duration-500",
                    isAllowed ? "bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20" : "bg-rose-500/10 text-rose-400 group-hover:bg-rose-500/20"
                )}>
                    {isAllowed ? (
                        <ShieldCheck className="h-5 w-5" />
                    ) : (
                        <ShieldAlert className="h-5 w-5" />
                    )}
                </div>
            </CardHeader>
            <CardContent className="relative space-y-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <div className={cn(
                            "text-4xl font-black tracking-tight",
                            isAllowed ? "text-emerald-400" : "text-rose-400"
                        )}>
                            {isAllowed ? 'GEÇİT VERİLDİ' : 'ENGELLEME'}
                        </div>
                        <p className="text-sm font-medium text-muted-foreground/80 leading-relaxed max-w-[200px]">
                            {blocker.reason}
                        </p>
                    </div>
                    <div className="text-center">
                        <div className={cn(
                            "text-3xl font-black p-4 rounded-3xl min-w-[80px] ring-1",
                            isAllowed ? "status-allowed ring-emerald-500/20" : "status-blocked ring-rose-500/20"
                        )}>
                            {blocker.consistency_score}
                        </div>
                        <p className="text-[10px] font-bold text-muted-foreground mt-2 uppercase tracking-tighter">Skor</p>
                    </div>
                </div>

                <div className={cn(
                    "p-4 rounded-2xl flex items-center gap-3 text-xs font-bold ring-1",
                    isAllowed ? "bg-emerald-500/5 text-emerald-500/70 ring-emerald-500/10" : "bg-rose-500/5 text-rose-500/70 ring-rose-500/10"
                )}>
                    <Shield className="h-4 w-4" />
                    <span>
                        {isAllowed
                            ? 'Piyasa filtreleri stabiliteyi onaylıyor.'
                            : 'Anomali tespit edildi - Aksiyon riskli.'}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}