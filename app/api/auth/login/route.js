import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

async function getCredentials() {
    try {
        const configPath = path.join(process.cwd(), 'data', 'config.json');
        const data = await fs.readFile(configPath, 'utf8');
        const config = JSON.parse(data);
        return { username: config.adminUsername || 'admin', password: config.adminPassword || 'password' };
    } catch (error) {
        return { username: 'admin', password: 'password' };
    }
}

export async function POST(request) {
    try {
        console.log('🔐 [API] بدء معالجة تسجيل الدخول');
        
        const { username, password } = await request.json();
        console.log('📝 [API] البيانات المستلمة:', { username, password: '***' });
        
        const credentials = await getCredentials();
        console.log('🔑 [API] البيانات المخزنة:', { username: credentials.username, password: '***' });

        if (username === credentials.username && password === credentials.password) {
            console.log('✅ [API] البيانات صحيحة! جاري إنشاء Cookie');
            
            const response = NextResponse.json({ success: true, message: 'تم تسجيل الدخول بنجاح' });
            
            const cookieOptions = {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 604800, // 7 days
                path: '/'
            };
            
            console.log('🍪 [API] إعدادات Cookie:', cookieOptions);
            response.cookies.set('auth_token', 'authenticated', cookieOptions);
            
            console.log('✅ [API] تم إرسال الاستجابة بنجاح');
            return response;
        } else {
            console.error('❌ [API] بيانات خاطئة');
            return NextResponse.json({ success: false, message: 'اسم المستخدم أو كلمة المرور غير صحيحة' }, { status: 401 });
        }
    } catch (error) {
        console.error('💥 [API] خطأ في السيرفر:', error);
        return NextResponse.json({ success: false, message: 'حدث خطأ في الخادم: ' + error.message }, { status: 500 });
    }
}
