import { NextResponse } from 'next/server';

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'] };

const hits = new Map<string,{count:number,ts:number}>();

export function middleware(req: Request) {
  const url = new URL(req.url);
  const want = 'www.ticketpay.us.com';

  if (process.env.NODE_ENV === 'production' && url.hostname.toLowerCase() !== want) {
    // ensure we redirect to canonical host (hostname only) and drop any port
    url.hostname = want;
    url.port = '';
    return NextResponse.redirect(url, 308);
  }

  if (url.pathname.startsWith('/api/')) {
    const ip = (req.headers as any).get?.('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
    const now = Date.now();
    const rec = hits.get(ip) || { count: 0, ts: now };
    if (now - rec.ts > 60_000) { rec.count = 0; rec.ts = now; }
    rec.count++; hits.set(ip, rec);
    if (rec.count > 60) return new Response('Rate limit', { status: 429 });
  }

  return NextResponse.next();
}
