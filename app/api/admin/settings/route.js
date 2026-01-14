import { NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';

const CONFIG_FILE = path.join(process.cwd(), 'data', 'config.json');

export async function GET() {
  try {
    const config = JSON.parse(readFileSync(CONFIG_FILE, 'utf8'));
    return NextResponse.json({ 
      siteTitle: config.siteTitle || 'Link Manager',
      siteDescription: config.siteDescription || 'منصة إدارة الروابط'
    });
  } catch (error) {
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { currentPassword, newUsername, newPassword, siteTitle, siteDescription } = await request.json();
    
    const config = JSON.parse(readFileSync(CONFIG_FILE, 'utf8'));
    
    if (config.adminPassword !== currentPassword) {
      return NextResponse.json({ error: 'كلمة المرور الحالية غير صحيحة' }, { status: 401 });
    }
    
    if (newUsername && newUsername.trim()) {
      config.adminUsername = newUsername.trim();
    }
    
    if (newPassword && newPassword.trim()) {
      config.adminPassword = newPassword.trim();
    }
    
    if (siteTitle !== undefined) {
      config.siteTitle = siteTitle.trim() || 'Link Manager';
    }
    
    if (siteDescription !== undefined) {
      config.siteDescription = siteDescription.trim() || 'منصة إدارة الروابط';
    }
    
    writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Settings update error:', error);
    return NextResponse.json({ error: 'حدث خطأ في التحديث' }, { status: 500 });
  }
}
