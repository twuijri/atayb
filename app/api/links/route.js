import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

export async function GET() {
    try {
        const { data, error } = await supabaseServer
            .from('links')
            .select('*')
            .order('order', { ascending: true });

        if (error) {
            console.error('Error fetching links:', error);
            return NextResponse.json([]);
        }

        return NextResponse.json(data || []);
    } catch (error) {
        console.error('Error fetching links:', error);
        return NextResponse.json([]);
    }
}

export async function POST(request) {
    try {
        const body = await request.json();

        if (Array.isArray(body)) {
            // Upsert all links (for reordering)
            const { error } = await supabaseServer
                .from('links')
                .upsert(body, { onConflict: 'id' });

            if (error) {
                console.error('Error updating links:', error);
                return NextResponse.json({ success: false, message: error.message }, { status: 500 });
            }

            return NextResponse.json({ success: true, message: "Links updated" });
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

        const { error } = await supabaseServer
            .from('links')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting link:', error);
            return NextResponse.json({ success: false, message: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: "Link deleted" });
    } catch (error) {
        console.error('Error deleting link:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
