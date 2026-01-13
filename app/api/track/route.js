import { NextResponse } from 'next/server';
const { readStats, writeStats } = require('@/lib/database');

export async function POST(request) {
    try {
        const { type } = await request.json();
        const stats = readStats();

        if (type === 'page_view') {
            stats.page_views = (stats.page_views || 0) + 1;
        } else if (type === 'click') {
            stats.link_clicks = (stats.link_clicks || 0) + 1;
        }

        writeStats(stats);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}

export async function GET() {
    try {
        const stats = readStats();
        return NextResponse.json(stats);
    } catch (error) {
        return NextResponse.json({ page_views: 0, link_clicks: 0 });
    }
}
