import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

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
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        
        // Ensure uploads directory exists
        await fs.mkdir(uploadsDir, { recursive: true });
        
        // Save file to local filesystem
        const filePath = path.join(uploadsDir, filename);
        await fs.writeFile(filePath, buffer);

        // Return public URL
        const publicUrl = `/uploads/${filename}`;

        return NextResponse.json({ 
            success: true, 
            url: publicUrl 
        });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
