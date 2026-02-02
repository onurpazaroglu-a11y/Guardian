import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req, res });

    const {
        data: { session },
    } = await supabase.auth.getSession();

    // Auth required paths
    const authRequired = ['/dashboard', '/api/engine'];
    const isAuthRequired = authRequired.some(path =>
        req.nextUrl.pathname.startsWith(path)
    );

    /* 
    if (isAuthRequired && !session) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    // Redirect authenticated users away from auth pages
    if (session && (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/register')) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    */

    return res;
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.svg).*)'],
};