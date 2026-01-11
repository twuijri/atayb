import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

let db = null;

export function getDatabase() {
    if (db) return db;

    const dbPath = path.join(process.cwd(), 'data', 'database.db');
    const dbDir = path.dirname(dbPath);

    // Create data directory if it doesn't exist
    if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
    }

    db = new Database(dbPath);
    
    // Initialize database tables
    initializeTables();
    
    return db;
}

function initializeTables() {
    // Links table
    db.exec(`
        CREATE TABLE IF NOT EXISTS links (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            url TEXT NOT NULL,
            icon TEXT,
            is_active INTEGER DEFAULT 1,
            display_order INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Track/analytics table
    db.exec(`
        CREATE TABLE IF NOT EXISTS analytics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            page_view INTEGER DEFAULT 0,
            link_clicks INTEGER DEFAULT 0,
            unique_visitors INTEGER DEFAULT 0,
            last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Initialize analytics with default row if empty
    const analytics = db.prepare('SELECT COUNT(*) as count FROM analytics').get();
    if (analytics.count === 0) {
        db.prepare('INSERT INTO analytics (page_view, link_clicks, unique_visitors) VALUES (0, 0, 0)').run();
    }

    console.log('✅ Database initialized successfully');
}

export default getDatabase;
