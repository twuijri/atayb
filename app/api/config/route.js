import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    const configPath = path.join(process.cwd(), 'data', 'config.json');
    const data = await fs.readFile(configPath, 'utf8');
    const config = JSON.parse(data);
    
    return Response.json({ 
      logo: config.logo || null, 
      siteTitle: config.siteTitle || 'Link Manager' 
    });
  } catch (error) {
    console.error('Error reading config:', error);
    return Response.json({ logo: null, siteTitle: 'Link Manager' });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { logo, siteTitle } = body;
    
    const configPath = path.join(process.cwd(), 'data', 'config.json');
    
    // Read existing config
    let config = {};
    try {
      const data = await fs.readFile(configPath, 'utf8');
      config = JSON.parse(data);
    } catch (err) {
      // File doesn't exist, will create new
    }
    
    // Update config
    if (logo !== undefined) config.logo = logo;
    if (siteTitle !== undefined) config.siteTitle = siteTitle;
    
    // Save config
    await fs.writeFile(configPath, JSON.stringify(config, null, 2));
    
    return Response.json({ success: true, data: config });
  } catch (error) {
    console.error('Error saving config:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
  }
}
