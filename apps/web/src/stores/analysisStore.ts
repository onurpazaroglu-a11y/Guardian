import { create } from 'zustand';
import { AnalysisResponse, Strategy, UserTier } from '@/types/engine';

interface AnalysisState {
    // Current analysis
    currentAnalysis: AnalysisResponse | null;
    isAnalyzing: boolean;
    error: string | null;

    // Form state
    baseAsset: string;
    quoteAsset: string;
    symbol: string;
    interval: string;
    strategy: Strategy;

    // History
    recentAnalyses: AnalysisResponse[];

    // Actions
    setBaseAsset: (asset: string) => void;
    setQuoteAsset: (asset: string) => void;
    setSymbol: (symbol: string) => void;
    setInterval: (interval: string) => void;
    setStrategy: (strategy: Strategy) => void;
    setAnalysis: (analysis: AnalysisResponse | null) => void;
    setAnalyzing: (isAnalyzing: boolean) => void;
    setError: (error: string | null) => void;
    addToHistory: (analysis: AnalysisResponse) => void;
    reset: () => void;
}

const initialState = {
    currentAnalysis: null,
    isAnalyzing: false,
    error: null,
    baseAsset: 'TL_a',
    quoteAsset: 'TL_b',
    symbol: 'TL_aTL_b',
    interval: '1h',
    strategy: 'breakout' as Strategy,
    recentAnalyses: [],
};

export const useAnalysisStore = create<AnalysisState>((set) => ({
    ...initialState,

    setBaseAsset: (asset) => set((state) => {
        const base = asset.toUpperCase();
        return { baseAsset: base, symbol: `${base}${state.quoteAsset}` };
    }),
    setQuoteAsset: (asset) => set((state) => {
        const quote = asset.toUpperCase();
        return { quoteAsset: quote, symbol: `${state.baseAsset}${quote}` };
    }),
    setSymbol: (symbol) => set({ symbol: symbol.toUpperCase() }),
    setInterval: (interval) => set({ interval }),
    setStrategy: (strategy) => set({ strategy }),
    setAnalysis: (analysis) => set({ currentAnalysis: analysis }),
    setAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
    setError: (error) => set({ error }),

    addToHistory: (analysis) => set((state) => ({
        recentAnalyses: [analysis, ...state.recentAnalyses].slice(0, 10),
    })),

    reset: () => set(initialState),
}));