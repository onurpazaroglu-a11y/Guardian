'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { UpgradePrompt } from '@/components/shared/UpgradePrompt';
import { ShieldAlert, TrendingUp, History as HistoryIcon, Shield, ChevronRight, BarChart3, Search } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { createBrowserClient } from '@/lib/supabase';

const PLATFORM_INFO: Record<string, { label: string; icon: string }> = {
    binance: { label: 'Binance Global', icon: '🌐' },
    binance_tr: { label: 'Binance TR', icon: '🇹🇷' },
    coinbase: { label: 'Coinbase', icon: '🔷' },
    kraken: { label: 'Kraken', icon: '🐙' },
    kucoin: { label: 'KuCoin', icon: '🟢' },
    bybit: { label: 'Bybit', icon: '⚡' },
    okx: { label: 'OKX', icon: '⭕' },
};

// Popular trading pairs - in real app, this would come from the selected exchange's API
const ALL_PAIRS = [
    'BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'SOL/USDT', 'XRP/USDT', 'ADA/USDT',
    'DOGE/USDT', 'MATIC/USDT', 'DOT/USDT', 'AVAX/USDT', 'LINK/USDT', 'UNI/USDT',
    'ATOM/USDT', 'LTC/USDT', 'ETC/USDT', 'BCH/USDT', 'NEAR/USDT', 'APT/USDT',
    'ARB/USDT', 'OP/USDT', 'FTM/USDT', 'ALGO/USDT', 'VET/USDT', 'ICP/USDT',
    'BTC/EUR', 'ETH/EUR', 'BTC/TRY', 'ETH/TRY', 'USDT/TRY'
];

const INTERVALS = [
    { value: '1m', label: '1 Dakika' },
    { value: '5m', label: '5 Dakika' },
    { value: '15m', label: '15 Dakika' },
    { value: '30m', label: '30 Dakika' },
    { value: '1h', label: '1 Saat' },
    { value: '4h', label: '4 Saat' },
    { value: '1d', label: '1 Gün' },
];

export default function DashboardPage() {
    const { isPro, user } = useAuth();
    const supabase = createBrowserClient();

    const [availableMarkets, setAvailableMarkets] = useState<string[]>([]);
    const [selectedMarket, setSelectedMarket] = useState('');
    const [selectedPair, setSelectedPair] = useState('BTCUSDT');
    const [selectedInterval, setSelectedInterval] = useState('1h');
    const [pairSearch, setPairSearch] = useState('');

    // Load user's configured markets
    useEffect(() => {
        const loadMarkets = async () => {
            if (!user?.id) return;

            try {
                const { data } = await supabase
                    .from('profiles')
                    .select('api_keys')
                    .eq('id', user.id)
                    .single();

                if (data?.api_keys) {
                    const markets = Object.keys(data.api_keys);
                    setAvailableMarkets(markets);
                    if (markets.length > 0 && !selectedMarket) {
                        setSelectedMarket(markets[0]);
                    }
                }
            } catch (error) {
                console.error('Error loading markets:', error);
            }
        };

        loadMarkets();
    }, [user, supabase, selectedMarket]);

    // Smart pair search
    const filteredPairs = useMemo(() => {
        if (!pairSearch) return ALL_PAIRS;

        const search = pairSearch.toUpperCase().replace('/', '');
        return ALL_PAIRS.filter(pair => {
            const pairClean = pair.replace('/', '');
            return pairClean.includes(search) || pair.includes(pairSearch.toUpperCase());
        });
    }, [pairSearch]);

    return (
        <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-500 pb-10">
            {/* Welcome Section */}
            <div className="flex flex-col gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter gradient-text">
                        Hoş geldin, {user?.email?.split('@')[0]}
                    </h1>
                    <p className="text-lg text-muted-foreground font-medium max-w-xl">
                        Guardian karar destek sistemi ile piyasaları taramaya başlayın ve yapay zeka destekli sinyaller alın.
                    </p>
                </div>

                {/* Market Selection Panel */}
                <Card className="glass-card border-primary/20">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-primary" />
                            <CardTitle>Piyasa Seçimi</CardTitle>
                        </div>
                        <CardDescription>Analiz etmek istediğiniz borsa, parite ve zaman aralığını seçin.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {availableMarkets.length === 0 ? (
                            <div className="text-center py-8 border-2 border-dashed border-white/10 rounded-lg">
                                <Shield className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
                                <p className="text-sm text-muted-foreground mb-2">Henüz API anahtarı yapılandırılmamış.</p>
                                <p className="text-xs text-muted-foreground/60 mb-4">
                                    Piyasa verilerine erişmek için önce bir borsa API anahtarı eklemelisiniz.
                                </p>
                                <Link href="/dashboard/settings">
                                    <Button variant="outline" className="gap-2">
                                        <Shield className="h-4 w-4" />
                                        Ayarlara Git
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Borsa</label>
                                    <Select value={selectedMarket} onValueChange={setSelectedMarket}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableMarkets.map(market => {
                                                const info = PLATFORM_INFO[market];
                                                return (
                                                    <SelectItem key={market} value={market}>
                                                        <div className="flex items-center gap-2">
                                                            <span>{info?.icon || '🔑'}</span>
                                                            <span>{info?.label || market}</span>
                                                        </div>
                                                    </SelectItem>
                                                );
                                            })}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Parite</label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
                                        <Input
                                            placeholder="Ara: BTC, ETH..."
                                            value={pairSearch}
                                            onChange={(e) => setPairSearch(e.target.value)}
                                            className="pl-9"
                                        />
                                    </div>
                                    {pairSearch && (
                                        <div className="absolute z-50 w-full mt-1 max-h-60 overflow-auto bg-popover border border-white/10 rounded-lg shadow-lg">
                                            {filteredPairs.length === 0 ? (
                                                <div className="p-4 text-sm text-muted-foreground text-center">
                                                    Parite bulunamadı
                                                </div>
                                            ) : (
                                                filteredPairs.slice(0, 10).map(pair => (
                                                    <button
                                                        key={pair}
                                                        className="w-full px-4 py-2 text-left text-sm hover:bg-white/5 transition-colors"
                                                        onClick={() => {
                                                            setSelectedPair(pair.replace('/', ''));
                                                            setPairSearch('');
                                                        }}
                                                    >
                                                        {pair}
                                                    </button>
                                                ))
                                            )}
                                        </div>
                                    )}
                                    <Select value={selectedPair} onValueChange={setSelectedPair}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {ALL_PAIRS.slice(0, 15).map(pair => (
                                                <SelectItem key={pair} value={pair.replace('/', '')}>
                                                    {pair}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Zaman Aralığı</label>
                                    <Select value={selectedInterval} onValueChange={setSelectedInterval}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {INTERVALS.map(interval => (
                                                <SelectItem key={interval.value} value={interval.value}>
                                                    {interval.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {!isPro && <UpgradePrompt />}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass-card border-none ring-1 ring-white/10 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-red-500/20 transition-all" />

                    <CardHeader>
                        <div className="h-12 w-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 ring-1 ring-red-500/20">
                            <ShieldAlert className="h-6 w-6 text-red-500" />
                        </div>
                        <CardTitle className="text-xl font-bold">Blocker</CardTitle>
                        <CardDescription className="text-base">Risk analizi ve piyasa tutarlılık kontrolü ile işlemlerinizi koruyun.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center text-sm font-bold text-red-500 mt-2">
                            Blocker'a Git <ChevronRight className="h-4 w-4 ml-1" />
                        </div>
                        <Link href="/dashboard/blocker" className="absolute inset-0" />
                    </CardContent>
                </Card>

                <Card className="glass-card border-none ring-1 ring-white/10 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-green-500/20 transition-all" />

                    <CardHeader>
                        <div className="h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 ring-1 ring-green-500/20">
                            <TrendingUp className="h-6 w-6 text-green-500" />
                        </div>
                        <CardTitle className="text-xl font-bold">Signal</CardTitle>
                        <CardDescription className="text-base">Yapay zeka destekli alım-satım sinyalleri ve piyasa tutarlılık analizi.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center text-sm font-bold text-green-500 mt-2">
                            Signal'a Git <ChevronRight className="h-4 w-4 ml-1" />
                        </div>
                        <Link href="/dashboard/signal" className="absolute inset-0" />
                    </CardContent>
                </Card>

                <Card className="glass-card border-none ring-1 ring-white/10 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-purple-500/20 transition-all" />

                    <CardHeader>
                        <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 ring-1 ring-purple-500/20">
                            <Shield className="h-6 w-6 text-purple-500" />
                        </div>
                        <CardTitle className="text-xl font-bold">Hesap Ayarları</CardTitle>
                        <CardDescription className="text-base">API anahtarları ve abonelik yönetimi.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center text-sm font-bold text-purple-500 mt-2">
                            Ayarları Yapılandır <ChevronRight className="h-4 w-4 ml-1" />
                        </div>
                        <Link href="/dashboard/settings" className="absolute inset-0" />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}