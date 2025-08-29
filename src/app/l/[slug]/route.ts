import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase';

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  const s = getSupabaseServer();
  const { data } = await s.from('links').select('url,clicks').eq('slug', params.slug).maybeSingle();
  if (!data?.url) return NextResponse.redirect('/', 302);
  s.from('links').update({ clicks: (data.clicks ?? 0) + 1 }).eq('slug', params.slug).then(()=>{});
  return NextResponse.redirect(data.url, 302);
}
