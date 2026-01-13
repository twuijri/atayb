import { NextResponse } from 'next/server';

export function middleware(request) {
    const { pathname } = request.nextUrl;
    
    // Protect admin routes except login
    if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
        const token = request.cookies.get('auth_token');
        
        if (!token || token.value !== 'authenticated') {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }
    
    return NextResponse.next();
}

export const config = {
    matcher: '/admin/:path*'
};
