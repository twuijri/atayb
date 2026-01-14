import { NextResponse } from 'next/server';
import { getLogs, clearLogs } from '@/lib/logger';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit')) || 100;
        const level = searchParams.get('level');

        const logs = getLogs(limit, level);
        
        return NextResponse.json({ success: true, logs });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const success = clearLogs();
        
        if (success) {
            return NextResponse.json({ success: true, message: 'تم مسح السجلات' });
        } else {
            return NextResponse.json({ success: false, message: 'فشل مسح السجلات' }, { status: 500 });
        }
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
