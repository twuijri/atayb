import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const CONFIG_FILE = path.join(process.cwd(), 'data', 'config.json');

// Check if initial setup is done
export async function GET() {
  try {
    // Check if config file exists and has admin credentials
    try {
      const data = await fs.readFile(CONFIG_FILE, 'utf8');
      const config = JSON.parse(data);
      
      // Check if admin credentials exist
      if (config.adminUsername && config.adminPassword) {
        return NextResponse.json({ isConfigured: true });
      }
    } catch (error) {
      // File doesn't exist or is invalid
    }

    // Check environment variables as fallback
    if (process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ isConfigured: true });
    }

    // Not configured
    return NextResponse.json({ isConfigured: false });
  } catch (error) {
    console.error('Error checking setup:', error);
    return NextResponse.json({ isConfigured: false });
  }
}
