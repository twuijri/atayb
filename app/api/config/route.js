import { supabaseServer } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabaseServer
      .from('config')
      .select('*')
      .eq('id', 1)
      .single();

    if (error) {
      console.error('Error fetching config:', error);
      return Response.json({ logo: null });
    }

    return Response.json(data || { logo: null });
  } catch (error) {
    console.error('Error reading config:', error);
    return Response.json({ logo: null });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { logo } = body;

    const { data, error } = await supabaseServer
      .from('config')
      .upsert(
        { id: 1, logo, updated_at: new Date() },
        { onConflict: 'id' }
      )
      .select()
      .single();

    if (error) {
      console.error('Error saving config:', error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ success: true, config: data });
  } catch (error) {
    console.error('Error saving config:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
