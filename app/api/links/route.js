import { NextResponse } from 'next/server';
import getDatabase from '@/lib/database';

export async function GET() {
    try {
        const db = getDatabase();
        const links = db.prepare('SELECT * FROM links WHERE is_active = 1 ORDER BY display_order ASC').all();
        return NextResponse.json(links);
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json([]);
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const db = getDatabase();

        if (Array.isArray(body)) {
            const stmt = db.prepare('UPDATE links SET display_order = ? WHERE id = ?');
            for (const link of body) {
                stmt.run(link.display_order || link.order, link.id);
            }
            return NextResponse.json({ success: true });
        }

        if (body.id) {
            db.prepare('UPDATE links SET title = ?, url = ?, icon = ?, display_order = ? WHERE id = ?')
                .run(body.title, body.url, body.icon, body.display_order || 0, body.id);
        } else {
            db.prepare('INSERT INTO links (title, url, icon, display_order) VALUES (?, ?, ?, ?)')
                .run(body.title, body.url, body.icon, body.display_order || 0);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const { id } = await request.json();
        const db = getDatabase();
        db.prepare('DELETE FROM links WHERE id = ?').run(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
