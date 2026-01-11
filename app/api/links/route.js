import { NextResponse } from 'next/server';
import getDatabase from '@/lib/database';

export async function GET() {
    try {
        const db = getDatabase();
        const links = db.prepare('SELECT * FROM links WHERE is_active = 1 ORDER BY display_order ASC').all();
        return NextResponse.json(links || []);
    } catch (error) {
        console.error('Error fetching links:', error);
        return NextResponse.json([]);
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const db = getDatabase();

        if (Array.isArray(body)) {
            // Update order for multiple links
            const updateStmt = db.prepare('UPDATE links SET display_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
            const transaction = db.transaction((links) => {
                for (const link of links) {
                    updateStmt.run(link.display_order || link.order, link.id);
                }
            });
            transaction(body);
            return NextResponse.json({ success: true, message: 'Links updated' });
        }

        return NextResponse.json({ success: false, message: "Invalid data format" }, { status: 400 });
    } catch (error) {
        console.error('Error saving links:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const body = await request.json();
        const { id } = body;

        if (!id) {
            return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 });
        }

        const db = getDatabase();
        db.prepare('DELETE FROM links WHERE id = ?').run(id);

        return NextResponse.json({ success: true, message: "Link deleted" });
    } catch (error) {
        console.error('Error deleting link:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
