import { NextResponse } from 'next/server';
import getDatabase from '@/lib/database';

export async function POST(request) {
    try {
        const body = await request.json();
        const { type, linkId } = body;
        const db = getDatabase();

        if (type === 'page_view') {
            db.prepare('UPDATE analytics SET page_view = page_view + 1, last_updated = CURRENT_TIMESTAMP').run();
        } else if (type === 'click' && linkId) {
            db.prepare('UPDATE analytics SET link_clicks = link_clicks + 1, last_updated = CURRENT_TIMESTAMP').run();
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error tracking:', error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}

export async function GET() {
    try {
        const db = getDatabase();
        const stats = db.prepare('SELECT * FROM analytics LIMIT 1').get();
        return NextResponse.json(stats || { page_view: 0, link_clicks: 0, unique_visitors: 0 });
    } catch (error) {
        console.error('Error fetching stats:', error);
        return NextResponse.json({ page_view: 0, link_clicks: 0, unique_visitors: 0 });
    }
}

export async function GET() {
    try {
        const { data: stats, error } = await supabaseServer
            .from('stats')
            .select('*')
            .order('id', { ascending: true })
            .limit(1)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error('Error fetching stats:', error);
            return NextResponse.json({ pageViews: 0, clicks: {} });
        }

        return NextResponse.json({
            pageViews: stats?.page_views || 0,
            clicks: stats?.link_clicks || {}
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        return NextResponse.json({ pageViews: 0, clicks: {} });
    }
}
