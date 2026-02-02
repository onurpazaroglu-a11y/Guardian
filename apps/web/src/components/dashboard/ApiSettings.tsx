'use client';

import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Key, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function ApiSettings() {
    const { apiKeys, setApiKeys } = useAuthStore();
    const { toast } = useToast();

    const [apiKey, setApiKey] = useState(apiKeys?.binance_api_key || '');
    const [apiSecret, setApiSecret] = useState(apiKeys?.binance_secret || '');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        // Simulate save delay
        setTimeout(() => {
            setApiKeys({
                binance_api_key: apiKey,
                binance_secret: apiSecret,
            });
            setIsSaving(false);
            toast({
                title: "Ayarlar Kaydedildi",
                description: "Binance API anahtarlarınız başarıyla güncellendi.",
            });
        }, 800);
    };

    const isConfigured = !!apiKeys?.binance_api_key && !!apiKeys?.binance_secret;

    return (
        <Card className={isConfigured ? "" : "border-primary/50 shadow-lg shadow-primary/10"}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5 text-primary" />
                    Binance API Ayarları
                </CardTitle>
                <CardDescription>
                    Analizlerin borsa verileriyle yapılabilmesi için API anahtarlarınızı girmelisiniz.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">API Key</label>
                    <Input
                        type="password"
                        placeholder="Binance API Key"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">API Secret</label>
                    <Input
                        type="password"
                        placeholder="Binance API Secret"
                        value={apiSecret}
                        onChange={(e) => setApiSecret(e.target.value)}
                    />
                </div>
                <Button
                    className="w-full"
                    onClick={handleSave}
                    disabled={isSaving || !apiKey || !apiSecret}
                >
                    {isSaving ? "Kaydediliyor..." : (
                        <>
                            <Save className="mr-2 h-4 w-4" />
                            Ayarları Kaydet
                        </>
                    )}
                </Button>

                {isConfigured ? (
                    <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-600 dark:text-green-400 text-sm">
                        <CheckCircle2 className="h-4 w-4" />
                        API Anahtarları Aktif
                    </div>
                ) : (
                    <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-600 dark:text-amber-400 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        Henüz yapılandırılmadı
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
