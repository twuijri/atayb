import { NextResponse } from 'next/server';
const { readLinks, writeLinks } = require('@/lib/database');

export async function GET() {
    try {
        const links = readLinks();
        return NextResponse.json(links);
    } catch (error) {
        return NextResponse.json([]);
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        let links = readLinks();

        if (Array.isArray(body)) {
            writeLinks(body);
            return NextResponse.json({ success: true });
        }

        if (body.id) {
            links = links.map(link => link.id === body.id ? { ...link, ...body } : link);
        } else {
            const newId = links.length > 0 ? Math.max(...links.map(l => l.id)) + 1 : 1;
            links.push({ ...body, id: newId });
        }

        writeLinks(links);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const { id } = await request.json();
        let links = readLinks();
        links = links.filter(link => link.id !== id);
        writeLinks(links);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
