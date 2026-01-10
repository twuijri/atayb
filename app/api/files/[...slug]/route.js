import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request, { params }) {
  try {
    const slug = params.slug.join('/');
    const filePath = path.join(process.cwd(), 'data', slug);

    // Security check - prevent directory traversal
    if (!filePath.startsWith(path.join(process.cwd(), 'data'))) {
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
