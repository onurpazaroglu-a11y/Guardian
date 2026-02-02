'use client';

import { AnalysisForm } from '@/components/analysis/AnalysisForm';
import { AnalysisResult } from '@/components/analysis/AnalysisResult';
import { useAnalysisStore } from '@/stores/analysisStore';

export default function AnalysisPage() {
    const currentAnalysis = useAnalysisStore((state) => state.currentAnalysis);

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Analiz Paneli</h1>
                <p className="text-muted-foreground">
                    Yeni bir analiz başlatın ve borsa verilerini yorumlayın
                </p>
            </div>

            <AnalysisForm />

            {currentAnalysis && <AnalysisResult />}
        </div>
    );
}
