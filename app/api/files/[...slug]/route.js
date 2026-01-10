import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request, { params }) {
  try {
    // Handle params properly for catch-all route
    const slug = Array.isArray(params?.slug) ? params.slug.join('/') : params?.slug || '';
    
    if (!slug) {
      return NextResponse.json({ error: 'No file specified' }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'data', slug);

    // Security check - prevent directory traversal
    const dataDir = path.join(process.cwd(), 'data');
    if (!filePath.startsWith(dataDir)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);
    const contentType = getContentType(filePath);

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': 'inline',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('File serving error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const types = {
    '.pdf': 'application/pdf',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
  };
  return types[ext] || 'application/octet-stream';
}
