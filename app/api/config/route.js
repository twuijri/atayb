import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
    try {
        const configPath = path.join(process.cwd(), 'data', 'config.json');
        const data = await fs.readFile(configPath, 'utf8');
        const config = JSON.parse(data);
        return Response.json({ logo: config.logo || null, siteTitle: config.siteTitle || 'Link Manager' });
    } catch (error) {
        return Response.json({ logo: null, siteTitle: 'Link Manager' });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const configPath = path.join(process.cwd(), 'data', 'config.json');
        
        let config = {};
        try {
            const data = await fs.readFile(configPath, 'utf8');
            config = JSON.parse(data);
        } catch (err) {}
        
        if (body.logo !== undefined) config.logo = body.logo;
        if (body.siteTitle !== undefined) config.siteTitle = body.siteTitle;
        
        await fs.writeFile(configPath, JSON.stringify(config, null, 2));
        return Response.json({ success: true, data: config });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}
