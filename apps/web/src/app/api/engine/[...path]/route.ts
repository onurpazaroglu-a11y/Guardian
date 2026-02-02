import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function POST(
    request: NextRequest,
    { params }: { params: { path: string[] } }
) {
    return handleProxy(request, params.path);
}

export async function GET(
    request: NextRequest,
    { params }: { params: { path: string[] } }
) {
    return handleProxy(request, params.path);
}

async function handleProxy(request: NextRequest, pathSegments: string[]) {
    try {
        // Verify auth (Temporarily bypassed for testing)
        /*
        const supabase = createServerClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            return NextResponse.json(
                { error: { code: 'UNAUTHORIZED', message: 'Giriş gerekli' } },
                { status: 401 }
            );
        }
        */

        // Mock session data for bypassed auth
        const session = { user: { id: 'mock-id' }, access_token: 'dev-token' };
        const profile = { tier: 'pro' };

        /*
        // Get user tier
        const { data: profile } = await supabase
            .from('profiles')
            .select('tier')
            .eq('id', session.user.id)
            .single();
        */

        const enginePath = pathSegments.join('/');
        const searchParams = request.nextUrl.searchParams.toString();
        const queryString = searchParams ? `?${searchParams}` : '';

        const engineUrl = `${process.env.ENGINE_URL}/api/v1/${enginePath}${queryString}`;

        let body = undefined;
        if (request.method !== 'GET' && request.method !== 'HEAD') {
            body = await request.text();
        }

        const engineResponse = await fetch(engineUrl, {
            method: request.method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access_token}`,
            },
            body: body,
        });

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
