import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

export async function POST(request) {
    try {
        const data = await request.formData();
        const file = data.get('file');

        if (!file) {
            return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create unique filename
        const filename = `${Date.now()}-${file.name.replace(/\s/g, '-')}`;

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabaseServer
            .storage
            .from('uploads')
            .upload(filename, buffer, {
                contentType: file.type,
            });

        if (uploadError) {
            console.error('Upload error:', uploadError);
            return NextResponse.json({ success: false, error: uploadError.message }, { status: 500 });
        }

        // Get public URL
        const { data: urlData } = supabaseServer
            .storage
            .from('uploads')
            .getPublicUrl(filename);

        return NextResponse.json({ 
            success: true, 
            url: urlData.publicUrl 
        });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
