import { NextResponse, type NextRequest } from 'next/server';
import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'] };

const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN })
  : null;

const ratelimit = redis ? new Ratelimit({ redis, limiter: Ratelimit.fixedWindow(60, '60s') }) : null;

const fallbackHits = new Map<string,{count:number,ts:number}>();

export async function middleware(req: NextRequest) {
  const url = new URL(req.url);

  const want = process.env.CANONICAL_HOST || 'www.ticketpay.us.com';

  if (process.env.NODE_ENV === 'production' && url.hostname.toLowerCase() !== want) {
    url.hostname = want;
    url.port = '';
    return NextResponse.redirect(url, 308);
  }

  if (url.pathname.startsWith('/api/')) {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'local';
    if (ratelimit) {
      const res = await ratelimit.limit(ip);
      if (!res.success) return new Response('Rate limit', { status: 429 });
    } else {
      const now = Date.now();
      const rec = fallbackHits.get(ip) || { count: 0, ts: now };
      if (now - rec.ts > 60_000) { rec.count = 0; rec.ts = now; }
      rec.count++; fallbackHits.set(ip, rec);
      if (rec.count > 60) return new Response('Rate limit', { status: 429 });
    }
  }

  return NextResponse.next();
}
