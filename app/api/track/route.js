import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

export async function POST(request) {
    try {
        const body = await request.json();
        const { type, linkId } = body;

        // Get current stats (just get the first row)
        const { data: stats, error: fetchError } = await supabaseServer
            .from('stats')
            .select('*')
            .limit(1)
            .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
            console.error('Error fetching stats:', fetchError);
            return NextResponse.json({ success: false }, { status: 500 });
        }

        const statsId = stats?.id || null;
        let pageViews = stats?.page_views || 0;
        let linkClicks = stats?.link_clicks || {};

        // Update stats
        if (type === 'page_view') {
            pageViews += 1;
        } else if (type === 'click' && linkId) {
            linkClicks[linkId] = (linkClicks[linkId] || 0) + 1;
        }

        // Save updated stats
        const updateData = {
            page_views: pageViews,
            link_clicks: linkClicks
        };

        console.log('Saving stats:', { statsId, ...updateData });

        // If we have an ID, update that row. Otherwise insert new
        let saveError;
        if (statsId) {
            const response = await supabaseServer
                .from('stats')
                .update(updateData)
                .eq('id', statsId);
            saveError = response.error;
            console.log('Update response:', response);
        } else {
            const response = await supabaseServer
                .from('stats')
                .insert([updateData]);
            saveError = response.error;
            console.log('Insert response:', response);
        }

        if (saveError) {
            console.error('Error saving stats:', saveError);
            return NextResponse.json({ success: false }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error tracking:', error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}

export async function GET() {
    try {
        const { data: stats, error } = await supabaseServer
            .from('stats')
            .select('*')
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
