import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request) {
  try {
    const { supabaseUrl, supabaseAnonKey } = await request.json();

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: 'Missing Supabase credentials' },
        { status: 400 }
      );
    }

    // محاولة الاتصال بقاعدة البيانات
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // اختبار بسيط: محاولة جلب بيانات من جدول links
    const { data, error } = await supabase
      .from('links')
      .select('count')
      .limit(1);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'تم الاتصال بنجاح' 
    });
  } catch (error) {
    console.error('Connection test error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
