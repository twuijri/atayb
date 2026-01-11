import { NextResponse } from 'next/server';
import getDatabase from '@/lib/database';

export async function POST(request) {
    try {
        const { type } = await request.json();
        const db = getDatabase();

        if (type === 'page_view') {
            db.prepare('UPDATE analytics SET page_views = page_views + 1 WHERE id = 1').run();
        } else if (type === 'click') {
            db.prepare('UPDATE analytics SET link_clicks = link_clicks + 1 WHERE id = 1').run();
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}

export async function GET() {
    try {
        const db = getDatabase();
        const stats = db.prepare('SELECT * FROM analytics WHERE id = 1').get();
        return NextResponse.json(stats || { page_views: 0, link_clicks: 0 });
    } catch (error) {
        return NextResponse.json({ page_views: 0, link_clicks: 0 });
    }
}
