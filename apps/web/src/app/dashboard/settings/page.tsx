"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings, Key, Plus, Trash2, Save, Loader2, CheckCircle2 } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { createBrowserClient } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { createLog } from "@/lib/logger";

const AVAILABLE_PLATFORMS = [
    { value: "binance", label: "Binance Global", icon: "🌐" },
    { value: "binance_tr", label: "Binance TR", icon: "🇹🇷" },
    { value: "coinbase", label: "Coinbase", icon: "🔷" },
    { value: "kraken", label: "Kraken", icon: "🐙" },
    { value: "kucoin", label: "KuCoin", icon: "🟢" },
    { value: "bybit", label: "Bybit", icon: "⚡" },
    { value: "okx", label: "OKX", icon: "⭕" },
];

interface ApiKeyConfig {
    api_key: string;
    api_secret: string;
}

export default function SettingsPage() {
    const { user } = useAuth();
    const supabase = createBrowserClient();
    const { toast } = useToast();

    const [loading, setLoading] = useState(false);
    const [apiKeys, setApiKeys] = useState<Record<string, ApiKeyConfig>>({});

    // New API Key Form
    const [newPlatform, setNewPlatform] = useState("");
    const [newApiKey, setNewApiKey] = useState("");
    const [newApiSecret, setNewApiSecret] = useState("");

    useEffect(() => {
        const getSettings = async () => {
            if (!user?.id) return;

            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('api_keys')
                    .eq('id', user.id)
                    .single();

                if (data) {
                    setApiKeys(data.api_keys || {});
                }
            } catch (error) {
                console.error('Error loading settings!');
            }
        };

        getSettings();
    }, [user, supabase]);

    const addApiKey = () => {
        if (!newPlatform || !newApiKey || !newApiSecret) {
            toast({
                title: "Eksik Bilgi",
                description: "Lütfen tüm alanları doldurun.",
                variant: "destructive",
            });
            return;
        }

        setApiKeys(prev => ({
            ...prev,
            [newPlatform]: {
                api_key: newApiKey,
                api_secret: newApiSecret
            }
        }));

        setNewPlatform("");
        setNewApiKey("");
        setNewApiSecret("");

        toast({
            title: "Eklendi",
            description: "API anahtarı listeye eklendi. Kaydetmeyi unutmayın!",
        });
    };

    const removeApiKey = (platform: string) => {
        const updated = { ...apiKeys };
        delete updated[platform];
        setApiKeys(updated);

        toast({
            title: "Kaldırıldı",
            description: "API anahtarı listeden kaldırıldı. Kaydetmeyi unutmayın!",
        });
    };

    const saveSettings = async () => {
        if (!user?.id) return;
        setLoading(true);

        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    api_keys: apiKeys,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', user.id);

            if (error) throw error;

            // Create success log
            await createLog({
                userId: user.id,
                type: 'success',
                message: 'API ayarları güncellendi',
                details: `Yapılandırılan platformlar: ${Object.keys(apiKeys).join(', ') || 'Yok'}`,
                source: 'api_settings'
            });

            toast({
                title: "Başarılı",
                description: "API ayarlarınız kaydedildi.",
            });
        } catch (error) {
            // Create error log
            await createLog({
                userId: user.id,
                type: 'error',
                message: 'API ayarları güncellenirken hata oluştu',
                details: error instanceof Error ? error.message : 'Bilinmeyen hata',
                source: 'api_settings'
            });

            toast({
                title: "Hata",
                description: "Ayarlar kaydedilirken bir sorun oluştu.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const availablePlatformsForAdd = AVAILABLE_PLATFORMS.filter(
        p => !Object.keys(apiKeys).includes(p.value)
    );

    return (
        <div className="container mx-auto p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center ring-1 ring-purple-500/20">
                        <Settings className="h-6 w-6 text-purple-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight gradient-text">Ayarlar</h1>
                        <p className="text-muted-foreground">API bağlantılarınızı ve tercihlerinizi yönetin</p>
                    </div>
                </div>
            </div>

            {/* API Keys Management */}
            <Card>
                <CardHeader>
                    <CardTitle>API Anahtarları Yönetimi</CardTitle>
                    <CardDescription>
                        Farklı borsalar için API anahtarlarınızı ekleyin ve yönetin.
                        Dashboard'da bu borsalardan birini seçerek işlem yapabilirsiniz.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Existing API Keys */}
                    <div>
                        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            Kayıtlı API Anahtarları ({Object.keys(apiKeys).length})
                        </h4>
                        {Object.keys(apiKeys).length === 0 ? (
                            <div className="text-center py-8 border-2 border-dashed border-white/10 rounded-lg">
                                <Key className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
                                <p className="text-sm text-muted-foreground">Henüz API anahtarı eklenmedi.</p>
                                <p className="text-xs text-muted-foreground/60 mt-1">
                                    Aşağıdaki formu kullanarak yeni bir platform ekleyin.
                                </p>
                            </div>
                        ) : (
                            <div className="grid gap-3">
                                {Object.entries(apiKeys).map(([platform, config]) => {
                                    const platformInfo = AVAILABLE_PLATFORMS.find(p => p.value === platform);
                                    return (
                                        <div key={platform} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-white/5 hover:border-primary/20 transition-colors group">
                                            <div className="flex items-center gap-4 flex-1">
                                                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-xl">
                                                    {platformInfo?.icon || '🔑'}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-bold">
                                                        {platformInfo?.label || platform}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground font-mono">
                                                        Key: {config.api_key.substring(0, 12)}...{config.api_key.substring(config.api_key.length - 4)}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                                    <span className="text-xs text-green-500 font-medium">Aktif</span>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => removeApiKey(platform)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Add New API Key */}
                    {availablePlatformsForAdd.length > 0 && (
                        <div className="border-t pt-6">
                            <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
                                <Plus className="h-4 w-4 text-primary" />
                                Yeni API Anahtarı Ekle
                            </h4>
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">Platform Seçin</label>
                                    <Select value={newPlatform} onValueChange={setNewPlatform}>
                                        <SelectTrigger className="h-11">
                                            <SelectValue placeholder="Borsa platformu seçiniz..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availablePlatformsForAdd.map(platform => (
                                                <SelectItem key={platform.value} value={platform.value}>
                                                    <div className="flex items-center gap-2">
                                                        <span>{platform.icon}</span>
                                                        <span>{platform.label}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">API Key</label>
                                    <div className="relative">
                                        <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            type="text"
                                            placeholder="API anahtarınızı girin"
                                            className="pl-9 font-mono text-sm h-11"
                                            value={newApiKey}
                                            onChange={(e) => setNewApiKey(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">API Secret</label>
                                    <div className="relative">
                                        <Settings className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            type="password"
                                            placeholder="API gizli anahtarınızı girin"
                                            className="pl-9 font-mono text-sm h-11"
                                            value={newApiSecret}
                                            onChange={(e) => setNewApiSecret(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    className="w-full gap-2 h-11 border-primary/20 hover:bg-primary/10"
                                    onClick={addApiKey}
                                >
                                    <Plus className="h-4 w-4" />
                                    API Anahtarı Ekle
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Save Button */}
                    <div className="flex justify-end pt-4 border-t">
                        <Button
                            className="gap-2 h-11 px-8"
                            onClick={saveSettings}
                            disabled={loading || Object.keys(apiKeys).length === 0}
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            Ayarları Kaydet
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="border-blue-500/20 bg-blue-500/5">
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <Key className="h-4 w-4 text-blue-500" />
                        API Anahtarları Hakkında
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                    <p>• API anahtarlarınız güvenli bir şekilde şifrelenerek saklanır.</p>
                    <p>• Her platform için sadece <strong>okuma yetkisi</strong> olan API anahtarları kullanın.</p>
                    <p>• API anahtarlarınızı düzenli olarak yenilemenizi öneririz.</p>
                    <p>• Dashboard'da kaydettiğiniz platformlardan birini seçerek işlem yapabilirsiniz.</p>
                </CardContent>
            </Card>
        </div>
    );
}
