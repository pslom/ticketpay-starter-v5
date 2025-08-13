export async function GET() {
  return new Response(
    'User-agent: *
Allow: /
Sitemap: https://www.ticketpay.us.com/sitemap.xml
',
    { headers: { 'content-type': 'text/plain' } }
  );
}
