'use client';

import { useState, useCallback } from 'react';
import { useAnalysisStore } from '@/stores/analysisStore';
import { useAuthStore } from '@/stores/authStore';
import { engineApi } from '@/lib/engine';
import { AnalysisResponse } from '@/types/engine';

export function useAnalysis() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        symbol,
        interval,
        strategy,
        setAnalysis,
        addToHistory,
    } = useAnalysisStore();

    const tier = useAuthStore((state) => state.tier);

    const analyze = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await engineApi.analyze({
                symbol,
                interval,
                strategy,
                user_tier: tier,
            });

            setAnalysis(result);
            addToHistory(result);
            return result;
        } catch (err: any) {
            const message = err.response?.data?.error?.message || 'Analiz yapılamadı';
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [symbol, interval, strategy, tier, setAnalysis, addToHistory]);

    return {
        analyze,
        isLoading,
        error,
    };
}