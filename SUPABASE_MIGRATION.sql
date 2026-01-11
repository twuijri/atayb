-- Create tables for Link Manager

-- Config table (for logo and settings)
CREATE TABLE IF NOT EXISTS config (
  id BIGINT PRIMARY KEY DEFAULT 1,
  logo TEXT,
  "siteTitle" TEXT DEFAULT 'Link Manager',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Links table
CREATE TABLE IF NOT EXISTS links (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  url TEXT,
  icon TEXT,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Stats table
CREATE TABLE IF NOT EXISTS stats (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  page_views INTEGER DEFAULT 0,
  link_clicks JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE config ENABLE ROW LEVEL SECURITY;
ALTER TABLE links ENABLE ROW LEVEL SECURITY;
ALTER TABLE stats ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access" ON config;
DROP POLICY IF EXISTS "Allow public read access" ON links;
DROP POLICY IF EXISTS "Allow public read access" ON stats;

-- Create policies for public access (since we need anonymous access)
CREATE POLICY "Allow public read config" ON config FOR SELECT USING (true);
CREATE POLICY "Allow public read links" ON links FOR SELECT USING (true);
CREATE POLICY "Allow public read stats" ON stats FOR SELECT USING (true);

-- Allow authenticated users to insert/update
CREATE POLICY "Allow authenticated insert config" ON config FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update config" ON config FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated insert links" ON links FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update links" ON links FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated insert stats" ON stats FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update stats" ON stats FOR UPDATE USING (true);

-- Insert default config
INSERT INTO config (id, logo, "siteTitle") VALUES (1, NULL, 'Link Manager') ON CONFLICT (id) DO NOTHING;

-- Initialize storage bucket
-- Note: Create 'uploads' bucket manually in Supabase Dashboard
