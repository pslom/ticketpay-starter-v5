import { NextResponse } from 'next/server';

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'] };

export function middleware(req: Request) {
  const url = new URL(req.url);
  const want = 'www.ticketpay.us.com';
  if (process.env.NODE_ENV === 'production' && url.host.toLowerCase() !== want) {
    url.host = want;
    return NextResponse.redirect(url, 308);
  }
  return NextResponse.next();
}
