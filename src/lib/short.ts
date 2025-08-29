import { getSupabaseServer } from '@/lib/supabase';
import { customAlphabet } from 'nanoid';

const make = customAlphabet('abcdefghijkmnopqrstuvwxyz0123456789', 6);

export async function createShort(url: string, label?: string) {
  const s = getSupabaseServer();
  let slug = make();
  for (let i=0;i<5;i++) {
    const { error } = await s.from('links').insert({ slug, url, label });
    if (!error) {
      const origin = process.env.SHORT_BASE_ORIGIN || process.env.NEXT_PUBLIC_SITE_ORIGIN || '';
      const shortUrl = origin ? `${origin}/l/${slug}` : `/l/${slug}`;
      return { slug, shortUrl };
    }
    slug = make();
  }
  throw new Error('could not create short link');
}
