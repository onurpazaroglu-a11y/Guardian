import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatNumber(num: number, decimals = 2): string {
    return new Intl.NumberFormat('tr-TR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(num);
}

export function formatPercent(num: number): string {
    return new Intl.NumberFormat('tr-TR', {
        style: 'percent',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
    }).format(num / 100);
}

export function formatDate(date: string | Date): string {
    return new Intl.DateTimeFormat('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(date));
}

export function getIntervalLabel(interval: string): string {
    const labels: Record<string, string> = {
        '15s': '15 Saniye',
        '1m': '1 Dakika',
        '5m': '5 Dakika',
        '15m': '15 Dakika',
        '30m': '30 Dakika',
        '1h': '1 Saat',
        '4h': '4 Saat',
        '1d': '1 Gün',
    };
    return labels[interval] || interval;
}

export function getStrategyLabel(strategy: string): string {
    const labels: Record<string, string> = {
        breakout: 'Kırılım (Breakout)',
        pullback: 'Düzeltme (Pullback)',
        continuation: 'Devam (Continuation)',
    };
    return labels[strategy] || strategy;
}