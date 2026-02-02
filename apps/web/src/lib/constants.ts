export const APP_NAME = 'Guardian';
export const APP_DESCRIPTION = 'Manuel Trader\'lar için Karar Destek Sistemi';

export const FREE_TIER = {
    name: 'Free',
    intervals: ['4h', '1d'],
    features: [
        '4H ve 1D interval analizi',
        'Gecikmeli skor (1 mum)',
        'Temel Blocker + Signal',
        'Logger metrikleri',
    ],
    limits: {
        maxAnalysesPerDay: 50,
        delayedData: true,
    },
};

export const PRO_TIER = {
    name: 'Pro',
    intervals: ['15s', '1m', '5m', '15m', '30m', '1h', '4h', '1d'],
    features: [
        'Tüm interval\'ler (15S - 1D)',
        'Gerçek zamanlı skor',
        'Scalp & Daytrade desteği',
        'Gelişmiş Logger analizi',
        'API Key entegrasyonu',
        'Öncelikli destek',
    ],
    price: {
        monthly: 49,
        yearly: 499,
    },
};

export const BLOCKER_THRESHOLDS = {
    ALLOWED_MIN: 60,
    NEUTRAL_MIN: 40,
    NEUTRAL_MAX: 60,
};

export const SIGNAL_STRENGTH_COLORS = {
    WEAK: 'text-yellow-500',
    MODERATE: 'text-blue-500',
    STRONG: 'text-green-500',
};