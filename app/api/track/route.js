import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const statsPath = path.join(process.cwd(), 'data', 'stats.json');

// Helper to read stats
const getStats = () => {
    if (!fs.existsSync(statsPath)) {
        return { pageViews: 0, clicks: {} };
    }
    const fileContent = fs.readFileSync(statsPath, 'utf8');
    return JSON.parse(fileContent);
};

// Helper to write stats
const saveStats = (data) => {
    fs.writeFileSync(statsPath, JSON.stringify(data, null, 2));
};

export async function POST(request) {
    try {
        const body = await request.json();
        const { type, linkId } = body;

        const stats = getStats();

        if (type === 'page_view') {
            stats.pageViews = (stats.pageViews || 0) + 1;
        } else if (type === 'click' && linkId) {
            stats.clicks[linkId] = (stats.clicks[linkId] || 0) + 1;
        }

        saveStats(stats);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}

export async function GET() {
    const stats = getStats();
    return NextResponse.json(stats);
}
