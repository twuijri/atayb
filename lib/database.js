const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(process.cwd(), 'data');
const LINKS_FILE = path.join(DATA_DIR, 'links.json');
const STATS_FILE = path.join(DATA_DIR, 'stats.json');

function ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
}

function readLinks() {
    try {
        ensureDataDir();
        if (!fs.existsSync(LINKS_FILE)) {
            return [];
        }
        const data = fs.readFileSync(LINKS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

function writeLinks(links) {
    ensureDataDir();
    fs.writeFileSync(LINKS_FILE, JSON.stringify(links, null, 2));
}

function readStats() {
    try {
        ensureDataDir();
        if (!fs.existsSync(STATS_FILE)) {
            return { page_views: 0, link_clicks: 0 };
        }
        const data = fs.readFileSync(STATS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return { page_views: 0, link_clicks: 0 };
    }
}

function writeStats(stats) {
    ensureDataDir();
    fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2));
}

module.exports = { readLinks, writeLinks, readStats, writeStats };
