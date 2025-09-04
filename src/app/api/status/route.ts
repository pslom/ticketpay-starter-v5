import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data } = await supabase
    .from('jurisdiction')
    .select('last_import')
    .eq('name', 'San Francisco')
    .eq('state', 'CA')
    .limit(1)
    .maybeSingle();

  const lastImportISO = data?.last_import ?? null;
  const ok = lastImportISO
    ? Date.now() - new Date(lastImportISO).getTime() < 36 * 60 * 60 * 1000
    : false;

  return NextResponse.json({
    status: ok ? 'operational' : 'degraded',
    lastImportISO,
    source: 'SFMTA daily feed',
  });
}
