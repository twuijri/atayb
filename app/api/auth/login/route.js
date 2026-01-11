import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// قراءة معلومات الدخول من ملف config.json أو المتغيرات البيئية
async function getCredentials() {
    try {
        const configPath = path.join(process.cwd(), 'data', 'config.json');
        const data = await fs.readFile(configPath, 'utf8');
        const config = JSON.parse(data);
        return {
            username: config.adminUsername || 'admin',
            password: config.adminPassword || ''
        };
    } catch (error) {
        // إذا لم يوجد الملف، استخدم المتغيرات البيئية أو القيم الافتراضية
        return {
            username: process.env.ADMIN_USERNAME || 'admin',
            password: process.env.ADMIN_PASSWORD || ''
        };
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { username, password } = body;

        console.log('Login attempt:', username);

        // Get credentials from config
        const credentials = await getCredentials();

        // Check credentials
        if (username === credentials.username && password === credentials.password) {
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

            // Set admin_logged_in cookie
            response.cookies.set('admin_logged_in', 'true', {
                httpOnly: false,
                secure: false,
                sameSite: 'lax',
                maxAge: 86400,
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
