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
        const { username, password } = await request.json();
        const credentials = await getCredentials();

        if (username === credentials.username && password === credentials.password) {
            const response = NextResponse.json({ success: true, message: 'تم تسجيل الدخول بنجاح' });
            response.cookies.set('auth_token', 'valid_session_token', {
                httpOnly: false,
                secure: false,
                sameSite: 'lax',
                maxAge: 86400,
                path: '/'
            });
            return response;
        } else {
            return NextResponse.json({ success: false, message: 'اسم المستخدم أو كلمة المرور غير صحيحة' }, { status: 401 });
        }
    } catch (error) {
        return NextResponse.json({ success: false, message: 'حدث خطأ في الخادم' }, { status: 500 });
    }
}
