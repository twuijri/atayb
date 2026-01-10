import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qxhsywktcdhsmdkcdyor.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4aHN5d2t0Y2Roc21ka2NkeW9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwNTU3MDMsImV4cCI6MjA4MzYzMTcwM30.RYwpn4Kun43eU_JvNrBtVYGimpXu5DB1O8VeM_IinA8';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4aHN5d2t0Y2Roc21ka2NkeW9yIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODA1NTcwMywiZXhwIjoyMDgzNjMxNzAzfQ.F8X0CNojmUs3p2ia6Wr3gV4JE74jUYqOIJj7Ies1Sm0';

// Client for browser (anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client for server (service role key)
export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey);
