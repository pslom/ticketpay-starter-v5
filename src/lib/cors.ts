const ALLOWED_ORIGINS = [
  "https://ticketpay.us.com",
  "https://www.ticketpay.us.com",
  "http://localhost:3010",
  "http://localhost:3020"
];

export function corsHeaders(origin?: string) {
  const allow = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "access-control-allow-origin": allow,
    "access-control-allow-methods": "GET, POST, OPTIONS",
    "access-control-allow-headers": "content-type",
    "access-control-max-age": "86400",
  } as Record<string, string>;
}
