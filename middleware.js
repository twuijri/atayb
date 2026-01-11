import { NextResponse } from 'next/server';

export function middleware(request) {
    // Check if the path starts with /admin
    if (request.nextUrl.pathname.startsWith('/admin')) {
        // Allow access to login, setup pages, and setup/check API
        if (request.nextUrl.pathname === '/admin/login' || 
            request.nextUrl.pathname === '/admin/setup' ||
            request.nextUrl.pathname.startsWith('/api/admin/setup')) {
            return NextResponse.next();
        }

        // Check for auth cookie
        const authCookie = request.cookies.get('auth_token');

        // Check if cookie exists and has valid value
        if (!authCookie || authCookie.value !== 'valid_session_token') {
            // Redirect to login
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/api/admin/:path*'],
};
