import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json();
        const { username, password } = body;

        console.log('Login attempt:', username);

        // Check credentials
        if (username === 'admin' && password === 'atayb2025') {
            console.log('Valid credentials');
            
            // Create response with successful message
            const response = NextResponse.json({
                success: true,
                message: 'تم تسجيل الدخول بنجاح'
            });

            // Set cookie server-side (more reliable)
            response.cookies.set('auth_token', 'valid_session_token', {
                httpOnly: false, // Allow client to read
                secure: false, // For localhost
                sameSite: 'lax',
                maxAge: 86400, // 24 hours
                path: '/'
            });

            return response;
        } else {
            console.log('Invalid credentials');
            return NextResponse.json(
                {
                    success: false,
                    message: 'اسم المستخدم أو كلمة المرور غير صحيحة'
                },
                { status: 401 }
            );
        }
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { success: false, message: 'حدث خطأ في الخادم' },
            { status: 500 }
        );
    }
}
