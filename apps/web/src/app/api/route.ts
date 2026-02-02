import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
    try {
        // Verify auth
        const supabase = createServerClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            return NextResponse.json(
                { error: { code: 'UNAUTHORIZED', message: 'Giriş gerekli' } },
                { status: 401 }
            );
        }

        // Get user tier
        const { data: profile } = await supabase
            .from('profiles')
            .select('tier')
            .eq('id', session.user.id)
            .single();

        const body = await request.json();

        // Forward to Python engine
        const engineResponse = await fetch(
            `${process.env.ENGINE_URL}/api/v1/analyze`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({
                    ...body,
                    user_tier: profile?.tier || 'free',
                }),
            }
        );

        const data = await engineResponse.json();

        if (!engineResponse.ok) {
            return NextResponse.json(
                { error: { code: 'ENGINE_ERROR', message: data.detail || 'Engine error' } },
                { status: engineResponse.status }
            );
        }

        return NextResponse.json(data);

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: { code: 'INTERNAL_ERROR', message: 'Sunucu hatası' } },
            { status: 500 }
        );
    }
}