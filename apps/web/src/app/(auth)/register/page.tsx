'use client';

import Link from 'next/link';
import { Shield, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/50 p-4">
            <Card className="w-full max-w-md shadow-xl border-muted/50">
                <CardHeader className="space-y-1 flex flex-col items-center">
                    <div className="p-3 rounded-2xl bg-primary/10 mb-4">
                        <Shield className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight">Kayıt Ol</CardTitle>
                    <CardDescription>
                        Yeni bir Guardian hesabı oluşturun
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none" htmlFor="name">
                            Ad Soyad
                        </label>
                        <Input id="name" placeholder="John Doe" type="text" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none" htmlFor="email">
                            E-posta
                        </label>
                        <Input id="email" placeholder="ornek@mail.com" type="email" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none" htmlFor="password">
                            Şifre
                        </label>
                        <Input id="password" placeholder="••••••••" type="password" />
                    </div>
                    <Button className="w-full h-11 text-base font-semibold" disabled>
                        Kayıt Ol (Pek Yakında)
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </CardContent>
                <CardFooter className="text-center text-sm text-muted-foreground flex justify-center">
                    Zaten hesabınız var mı?{' '}
                    <Link href="/login" className="text-primary font-medium hover:underline underline-offset-4 ml-1">
                        Giriş Yap
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
