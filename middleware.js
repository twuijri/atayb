import { NextResponse } from 'next/server';

export function middleware(request) {
    const { pathname } = request.nextUrl;
    
    console.log('🛡️ [Middleware] فحص المسار:', pathname);
    
    // Protect admin routes except login
    if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
        const token = request.cookies.get('auth_token');
        
        console.log('🍪 [Middleware] الكوكي:', token ? `موجود (${token.value})` : 'غير موجود');
        console.log('🍪 [Middleware] كل الكوكيز:', request.cookies.getAll());
        
        if (!token || token.value !== 'authenticated') {
            console.log('❌ [Middleware] ممنوع - تحويل للتسجيل');
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
        
        console.log('✅ [Middleware] مصرح - السماح بالدخول');
    }
    
    return NextResponse.next();
}

export const config = {
    matcher: '/admin/:path*'
};
