import { NextResponse } from 'next/server';
const { readStats, writeStats, readLinks, writeLinks } = require('@/lib/database');

export async function POST(request) {
    try {
        const { type, linkId } = await request.json();
        const stats = readStats();

        if (type === 'page_view') {
            stats.page_views = (stats.page_views || 0) + 1;
            writeStats(stats);
        } else if (type === 'click' && linkId) {
            // زيادة النقرات العامة
            stats.link_clicks = (stats.link_clicks || 0) + 1;
            writeStats(stats);
            
            // زيادة نقرات الرابط المحدد
            const links = readLinks();
            const linkIndex = links.findIndex(l => l.id === linkId);
            
            if (linkIndex !== -1) {
                links[linkIndex].clicks = (links[linkIndex].clicks || 0) + 1;
                writeLinks(links);
                console.log(`✅ [Track] Link ${linkId} clicks: ${links[linkIndex].clicks}`);
            } else {
                console.warn(`⚠️ [Track] Link ${linkId} not found`);
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('❌ [Track] Error:', error);
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
