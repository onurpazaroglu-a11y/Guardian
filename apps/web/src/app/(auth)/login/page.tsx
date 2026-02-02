'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useAuthStore } from '@/stores/authStore';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const signIn = useAuthStore((state) => state.signIn);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await signIn(email, password);
            router.push('/dashboard');
        } catch (error) {
            console.error('Login failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/50 p-4">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
            </div>

            <Card className="w-full max-w-md relative z-10 shadow-xl border-muted/50">
                <CardHeader className="space-y-1 flex flex-col items-center">
                    <div className="p-3 rounded-2xl bg-primary/10 mb-4 transition-transform hover:scale-110 duration-300">
                        <Shield className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight">Giriş Yap</CardTitle>
                    <CardDescription>
                        Guardian hesabınıza erişmek için bilgilerinizi girin
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email">
                                E-posta
                            </label>
                            <Input
                                id="email"
                                placeholder="ornek@mail.com"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="bg-muted/30 focus:bg-background transition-colors"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium leading-none" htmlFor="password">
                                    Şifre
                                </label>
                                <Link href="#" className="text-xs text-primary hover:underline underline-offset-4">
                                    Şifremi Unuttum
                                </Link>
                            </div>
                            <Input
                                id="password"
                                placeholder="••••••••"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="bg-muted/30 focus:bg-background transition-colors"
                            />
                        </div>
                        <Button className="w-full h-11 text-base font-semibold" type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Giriş Yapılıyor...
                                </>
                            ) : (
                                <>
                                    Giriş Yap
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <div className="relative w-full">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-muted" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">Veya şununla devam et</span>
                        </div>
                    </div>
                    <div className="text-center text-sm text-muted-foreground">
                        Hesabınız yok mu?{' '}
                        <Link href="/register" className="text-primary font-medium hover:underline underline-offset-4">
                            Kayıt Ol
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
