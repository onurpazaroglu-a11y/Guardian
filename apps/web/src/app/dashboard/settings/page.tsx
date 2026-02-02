'use client';

import { ApiSettings } from '@/components/dashboard/ApiSettings';

export default function SettingsPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Ayarlar</h1>
                <p className="text-muted-foreground">
                    API anahtarlarınızı ve uygulama tercihlerini yönetin
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ApiSettings />
                {/* Gelecekte buraya profil ayarları vb. eklenebilir */}
            </div>
        </div>
    );
}
