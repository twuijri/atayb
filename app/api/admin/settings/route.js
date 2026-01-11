import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { cookies } from 'next/headers';

const CONFIG_FILE = path.join(process.cwd(), 'data', 'config.json');

// التأكد من وجود المجلد
async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// قراءة الإعدادات
async function readConfig() {
  try {
    await ensureDataDir();
    const data = await fs.readFile(CONFIG_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // إذا لم يوجد الملف، استخدم المتغيرات البيئية كقيم افتراضية
    return {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
      adminUsername: process.env.ADMIN_USERNAME || 'admin',
      adminPassword: process.env.ADMIN_PASSWORD || ''
    };
  }
}

// حفظ الإعدادات
async function saveConfig(config) {
  await ensureDataDir();
  await fs.writeFile(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf8');
}

// GET - قراءة الإعدادات
export async function GET(request) {
  try {
    // التحقق من تسجيل الدخول
    const cookieStore = await cookies();
    const isAuthenticated = cookieStore.get('admin_logged_in');

    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const config = await readConfig();
    
    // إخفاء جزء من المفاتيح للأمان
    return NextResponse.json({
      supabaseUrl: config.supabaseUrl,
      supabaseAnonKey: config.supabaseAnonKey,
      supabaseServiceKey: config.supabaseServiceKey,
      adminUsername: config.adminUsername,
      adminPassword: config.adminPassword
    });
  } catch (error) {
    console.error('Error reading config:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - حفظ الإعدادات
export async function POST(request) {
  try {
    // التحقق من تسجيل الدخول
    const cookieStore = await cookies();
    const isAuthenticated = cookieStore.get('admin_logged_in');

    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const config = await request.json();

    // التحقق من البيانات
    if (!config.supabaseUrl || !config.supabaseAnonKey || !config.adminUsername || !config.adminPassword) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // حفظ الإعدادات
    await saveConfig(config);

    return NextResponse.json({ 
      success: true, 
      message: 'تم حفظ الإعدادات بنجاح' 
    });
  } catch (error) {
    console.error('Error saving config:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
