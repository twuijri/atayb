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
      return Response.json({ logo: null, siteTitle: 'Link Manager' });
    }

    return Response.json(data || { logo: null, siteTitle: 'Link Manager' });
  } catch (error) {
    console.error('Error reading config:', error);
    return Response.json({ logo: null, siteTitle: 'Link Manager' });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { logo, siteTitle } = body;

    const updateData = { 
      id: 1, 
      updated_at: new Date() 
    };
    
    if (logo !== undefined) updateData.logo = logo;
    if (siteTitle !== undefined) updateData.siteTitle = siteTitle;

    const { data, error } = await supabaseServer
      .from('config')
      .upsert(
        updateData,
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
