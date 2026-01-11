import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const CONFIG_FILE = path.join(process.cwd(), 'data', 'config.json');

async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

export async function POST(request) {
  try {
    const { adminUsername, adminPassword, supabaseUrl, supabaseAnonKey, supabaseServiceKey } = await request.json();

    // Validate required fields
    if (!adminUsername || !adminPassword) {
      return NextResponse.json(
        { error: 'اسم المستخدم وكلمة المرور مطلوبان' },
        { status: 400 }
      );
    }

    // Check if already configured
    try {
      const existingData = await fs.readFile(CONFIG_FILE, 'utf8');
      const existingConfig = JSON.parse(existingData);
      if (existingConfig.adminUsername && existingConfig.adminPassword) {
        return NextResponse.json(
          { error: 'النظام تم إعداده مسبقاً' },
          { status: 400 }
        );
      }
    } catch (error) {
      // File doesn't exist, continue with setup
    }

    // Create config object
    const config = {
      adminUsername,
      adminPassword,
      supabaseUrl: supabaseUrl || '',
      supabaseAnonKey: supabaseAnonKey || '',
      supabaseServiceKey: supabaseServiceKey || '',
      createdAt: new Date().toISOString()
    };

    // Save to file
    await ensureDataDir();
    await fs.writeFile(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf8');

    return NextResponse.json({
      success: true,
      message: 'تم إعداد النظام بنجاح'
    });
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في الإعداد: ' + error.message },
      { status: 500 }
    );
  }
}
