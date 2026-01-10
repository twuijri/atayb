import fs from 'fs';
import path from 'path';

const configPath = path.join(process.cwd(), 'data', 'config.json');

// Initialize config file if it doesn't exist
function initializeConfig() {
  const dir = path.dirname(configPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(configPath)) {
    fs.writeFileSync(configPath, JSON.stringify({ logo: null }, null, 2));
  }
}

export async function GET() {
  try {
    initializeConfig();
    const data = fs.readFileSync(configPath, 'utf8');
    const config = JSON.parse(data);
    return Response.json(config);
  } catch (error) {
    console.error('Error reading config:', error);
    return Response.json({ logo: null });
  }
}

export async function POST(request) {
  try {
    initializeConfig();
    const body = await request.json();
    let { logo } = body;

    // Normalize logo path to always use /api/files
    if (logo && !logo.startsWith('/api/files')) {
      logo = `/api/files${logo.startsWith('/') ? logo : '/' + logo}`;
    }

    const config = {
      logo: logo || null
    };

    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    return Response.json({ success: true, config });
  } catch (error) {
    console.error('Error saving config:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
