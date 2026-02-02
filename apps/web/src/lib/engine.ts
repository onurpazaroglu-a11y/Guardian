import {
    AnalysisRequest,
    AnalysisResponse,
    UserMetrics,
    LogEntry
} from '@/types/engine';
import api from './api';

export const engineApi = {
    async analyze(request: AnalysisRequest): Promise<AnalysisResponse> {
        const { data } = await api.post<AnalysisResponse>('/engine/analyze', request, {
            headers: {
                'Authorization': 'Bearer dev-token'
            }
        });
        return data;
    },

    async getMetrics(symbol?: string, days = 30): Promise<UserMetrics> {
        const { data } = await api.get<UserMetrics>('/engine/metrics', {
            params: { symbol, days },
        });
        return data;
    },

    async getLogs(limit = 50, offset = 0): Promise<LogEntry[]> {
        const { data } = await api.get<LogEntry[]>('/engine/logs', {
            params: { limit, offset },
        });
        return data;
    },

    async validateLog(
        logId: string,
        exitPrice: number,
        result: 'SUCCESS' | 'FAILURE',
        pnlPercent?: number
    ): Promise<void> {
        await api.post(`/engine/logs/${logId}/validate`, {
            exit_price: exitPrice,
            result,
            pnl_percent: pnlPercent,
        });
    },

    getAvailableIntervals(tier: 'free' | 'pro') {
        return tier === 'free'
            ? ['4h', '1d']
            : ['15s', '1m', '5m', '15m', '30m', '1h', '4h', '1d'];
    },

    getAvailableStrategies() {
        return [
            { value: 'breakout', label: 'Kırılım (Breakout)', desc: 'Direncin kırılmasıyla giriş' },
            { value: 'pullback', label: 'Düzeltme (Pullback)', desc: 'Trende geri çekilme sonrası giriş' },
            { value: 'continuation', label: 'Devam (Continuation)', desc: 'Trend yönünde devam formasyonu' },
        ] as const;
    },
};