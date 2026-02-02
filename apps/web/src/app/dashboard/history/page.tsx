'use client';

import { useAnalysisStore } from '@/stores/analysisStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate, getIntervalLabel } from '@/lib/utils';
import { History, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HistoryPage() {
    const recentAnalyses = useAnalysisStore((state) => state.recentAnalyses);

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Analiz Geçmişi</h1>
                <p className="text-muted-foreground">
                    Daha önce yaptığınız analizlerin sonuçlarını inceleyin
                </p>
            </div>

            {recentAnalyses.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                    {recentAnalyses.map((analysis, index) => (
                        <Card key={`${analysis.symbol}-${index}`} className="hover:bg-accent/50 transition-colors">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <History className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold flex items-center gap-2">
                                                {analysis.symbol}
                                                <span className="text-[10px] border border-muted-foreground/30 px-1.5 py-0.5 rounded-full font-medium">
                                                    {getIntervalLabel(analysis.interval)}
                                                </span>
                                            </h3>
                                            <p className="text-xs text-muted-foreground">
                                                {formatDate(analysis.generated_at)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <div className="text-sm font-bold">{analysis.consistency.score}/100</div>
                                            <div className="text-[10px] uppercase text-muted-foreground">Skor</div>
                                        </div>
                                        <Link href="/dashboard/analysis">
                                            <Button variant="ghost" size="icon">
                                                <ArrowUpRight className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="rounded-full bg-muted p-4 mb-4">
                            <History className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium">Henüz analiz bulunmuyor</h3>
                        <p className="text-sm text-muted-foreground mt-2 max-w-sm">
                            Analiz panelini kullanarak ilk analizinizi başlatın
                        </p>
                        <Link href="/dashboard/analysis" className="mt-4">
                            <Button>Analiz Başlat</Button>
                        </Link>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
