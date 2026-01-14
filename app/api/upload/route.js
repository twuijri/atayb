import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { log } from '@/lib/logger';

export async function POST(request) {
    try {
        const data = await request.formData();
        const file = data.get('file');

        if (!file) {
            return NextResponse.json({ success: false, error: 'No file' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filename = `${Date.now()}-${file.name.replace(/\s/g, '-')}`;
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        
        await fs.mkdir(uploadsDir, { recursive: true });
        await fs.writeFile(path.join(uploadsDir, filename), buffer);

        log('success', 'تم رفع ملف', { filename, size: bytes.byteLength });

        return NextResponse.json({ success: true, url: `/api/uploads/${filename}` });
    } catch (error) {
        log('error', 'فشل رفع الملف', { error: error.message });
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
