import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request, { params }) {
  try {
    console.log('📁 [Uploads] Params:', params);
    console.log('📁 [Uploads] Params.slug:', params.slug);
    
    // Handle both awaited and non-awaited params
    const resolvedParams = await Promise.resolve(params);
    const slug = resolvedParams.slug ? resolvedParams.slug.join('/') : '';
    
    console.log('📁 [Uploads] Resolved slug:', slug);
    
    if (!slug) {
      console.error('❌ [Uploads] No slug provided');
      return NextResponse.json({ error: 'No file specified' }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'public', 'uploads', slug);
    console.log('📁 [Uploads] File path:', filePath);

    // Security check
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!filePath.startsWith(uploadsDir)) {
      console.error('❌ [Uploads] Security: Path traversal attempt');
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (!fs.existsSync(filePath)) {
      console.error('❌ [Uploads] File not found:', filePath);
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);
    const contentType = getContentType(filePath);
    
    console.log('✅ [Uploads] Serving file:', slug, 'Type:', contentType);

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': 'inline',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (error) {
    console.error('💥 [Uploads] Error:', error);
    return NextResponse.json({ error: 'Server error: ' + error.message }, { status: 500 });
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
    '.avif': 'image/avif',
    '.svg': 'image/svg+xml',
  };
  return types[ext] || 'application/octet-stream';
}
