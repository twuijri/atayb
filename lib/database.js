const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

let db = null;

function getDatabase() {
    if (db) return db;

    const dbPath = path.join(process.cwd(), 'data', 'database.db');
    const dbDir = path.dirname(dbPath);

    if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
    }

    db = new Database(dbPath);
    
    // Create tables
    db.exec(`
        CREATE TABLE IF NOT EXISTS links (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            url TEXT NOT NULL,
            icon TEXT,
            display_order INTEGER DEFAULT 0,
            is_active INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    db.exec(`
        CREATE TABLE IF NOT EXISTS analytics (
            id INTEGER PRIMARY KEY,
            page_views INTEGER DEFAULT 0,
            link_clicks INTEGER DEFAULT 0,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Insert default analytics row
    const exists = db.prepare('SELECT COUNT(*) as count FROM analytics').get();
    if (exists.count === 0) {
        db.prepare('INSERT INTO analytics (id, page_views, link_clicks) VALUES (1, 0, 0)').run();
    }

    console.log('✅ Database initialized');
    return db;
}

module.exports = getDatabase;
