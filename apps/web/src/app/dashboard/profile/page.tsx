"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Mail, Lock, Camera, Save, Loader2, Settings, Key } from "lucide-react";
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

export default function ProfilePage() {
    const { user } = useAuth();
    const supabase = createBrowserClient();
    const { toast } = useToast();

    const [loading, setLoading] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [preferredMarket, setPreferredMarket] = useState("");
    const [apiKey, setApiKey] = useState("");
    const [apiSecret, setApiSecret] = useState("");

    const [passLoading, setPassLoading] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
        const getProfile = async () => {
            if (!user?.id) return;

            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('first_name, last_name, preferred_market, api_key, api_secret')
                    .eq('id', user.id)
                    .single();

                if (data) {
                    setFirstName(data.first_name || "");
                    setLastName(data.last_name || "");
                    setPreferredMarket(data.preferred_market || "");
                    setApiKey(data.api_key || "");
                    setApiSecret(data.api_secret || "");
                }
            } catch (error) {
                console.error('Error loading user data!');
            }
        };

        getProfile();
    }, [user, supabase]);

    const updateProfile = async () => {
        if (!user?.id) return;
        setLoading(true);

        try {
            const { error } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    email: user.email,
                    first_name: firstName,
                    last_name: lastName,
                    preferred_market: preferredMarket,
                    api_key: apiKey,
                    api_secret: apiSecret,
                    updated_at: new Date().toISOString(),
                });

            if (error) throw error;

            // Create success log
            await createLog({
                userId: user.id,
                type: 'success',
                message: 'Profil ayarları güncellendi',
                details: `Borsa: ${preferredMarket || 'Seçilmedi'}, API: ${apiKey ? 'Yapılandırıldı' : 'Yapılandırılmadı'}`,
                source: 'profile_settings'
            });

            toast({
                title: "Başarılı",
                description: "Profil ve API bilgileriniz güncellendi.",
            });
        } catch (error) {
            // Create error log
            await createLog({
                userId: user.id,
                type: 'error',
                message: 'Profil güncellenirken hata oluştu',
                details: error instanceof Error ? error.message : 'Bilinmeyen hata',
                source: 'profile_settings'
            });

            toast({
                title: "Hata",
                description: "Profil güncellenirken bir sorun oluştu.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const updatePassword = async () => {
        if (password !== confirmPassword) {
            toast({
                title: "Hata",
                description: "Şifreler eşleşmiyor.",
                variant: "destructive",
            });
            return;
        }

        setPassLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) throw error;

            // Create success log
            await createLog({
                userId: user.id,
                type: 'success',
                message: 'Şifre başarıyla güncellendi',
                source: 'security_settings'
            });

            toast({
                title: "Başarılı",
                description: "Şifreniz başarıyla güncellendi.",
            });
            setPassword("");
            setConfirmPassword("");
        } catch (error) {
            toast({
                title: "Hata",
                description: "Şifre güncellenemedi. Lütfen tekrar deneyin.",
                variant: "destructive",
            });
        } finally {
            setPassLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black tracking-tight gradient-text w-fit">Profil Ayarları</h1>
                <p className="text-muted-foreground">Kişisel bilgilerinizi, API bağlantılarınızı ve hesap güvenliğinizi yönetin.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
                {/* Avatar Section */}
                <Card className="h-fit">
                    <CardHeader>
                        <CardTitle>Profil Fotoğrafı</CardTitle>
                        <CardDescription>Hesap görünürlüğünüzü özelleştirin.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-6">
                        <div className="relative group cursor-pointer">
                            <div className="h-40 w-40 rounded-full bg-gradient-to-br from-primary/20 to-violet-500/20 border-2 border-primary/20 flex items-center justify-center overflow-hidden shadow-2xl transition-all duration-300 group-hover:border-primary">
                                <span className="text-4xl font-black text-primary/50 group-hover:text-primary transition-colors">
                                    {(firstName?.[0] || user?.email?.[0] || "U").toUpperCase()}
                                </span>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-full backdrop-blur-sm">
                                <Camera className="h-8 w-8 text-white" />
                            </div>
                        </div>
                        <Button variant="outline" className="w-full" disabled>
                            Fotoğrafı Değiştir (Yakında)
                        </Button>
                    </CardContent>
                </Card>

                <div className="space-y-8">
                    {/* Personal Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Kişisel Bilgiler</CardTitle>
                            <CardDescription>İletişim ve kimlik bilgilerinizi güncelleyin.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Email Adresi</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input defaultValue={user?.email || ''} disabled className="pl-9 bg-muted/50" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">Ad</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Adınız"
                                            className="pl-9"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">Soyad</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Soyadınız"
                                            className="pl-9"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* API Configuration */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Borsa & API Yapılandırması</CardTitle>
                            <CardDescription>Tercih ettiğiniz borsa ve API anahtarlarınızı yönetin.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Tercih Edilen Borsa</label>
                                <Select value={preferredMarket} onValueChange={setPreferredMarket}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Borsa seçiniz" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="binance">Binance Global</SelectItem>
                                        <SelectItem value="binance_tr">Binance TR</SelectItem>
                                        <SelectItem value="coinbase">Coinbase</SelectItem>
                                        <SelectItem value="kraken">Kraken</SelectItem>
                                        <SelectItem value="kucoin">KuCoin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">API Key</label>
                                <div className="relative">
                                    <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="text"
                                        placeholder="API Anahtarınız"
                                        className="pl-9 font-mono"
                                        value={apiKey}
                                        onChange={(e) => setApiKey(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">API Secret</label>
                                <div className="relative">
                                    <Settings className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="password"
                                        placeholder="API Gizli Anahtarınız"
                                        className="pl-9 font-mono"
                                        value={apiSecret}
                                        onChange={(e) => setApiSecret(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end pt-2">
                                <Button className="gap-2" onClick={updateProfile} disabled={loading}>
                                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                    Ayarları Kaydet
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Security */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Güvenlik</CardTitle>
                            <CardDescription>Hesap şifrenizi güncelleyin.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Yeni Şifre</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="password"
                                        placeholder="********"
                                        className="pl-9"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Yeni Şifre (Tekrar)</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="password"
                                        placeholder="********"
                                        className="pl-9"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <Button variant="secondary" className="gap-2" onClick={updatePassword} disabled={passLoading || !password}>
                                    {passLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
                                    Şifreyi Güncelle
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
