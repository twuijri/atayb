import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// قراءة الإعدادات من ملف config.json المحلي أولاً
let configFromFile = null;
try {
  const configPath = path.join(process.cwd(), 'data', 'config.json');
  if (fs.existsSync(configPath)) {
    const fileContent = fs.readFileSync(configPath, 'utf8');
    configFromFile = JSON.parse(fileContent);
  }
} catch (error) {
  console.log('No local config file found, using environment variables');
}

// استخدام الإعدادات من الملف المحلي أولاً، ثم المتغيرات البيئية
const supabaseUrl = configFromFile?.supabaseUrl || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = configFromFile?.supabaseAnonKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = configFromFile?.supabaseServiceKey || process.env.SUPABASE_SERVICE_ROLE_KEY;

// Create dummy clients if not configured (for build time)
// Real clients will be created after configuration
let supabase = null;
let supabaseServer = null;

if (supabaseUrl && supabaseAnonKey) {
  // Client for browser (anon key)
  supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Client for server (service role key)
  supabaseServer = supabaseServiceKey 
    ? createClient(supabaseUrl, supabaseServiceKey)
    : supabase;
} else {
  console.warn('⚠️  Supabase not configured - will be configured via admin panel');
}

export { supabase, supabaseServer };

