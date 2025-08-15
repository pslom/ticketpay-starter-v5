import { NextResponse, type NextRequest } from "next/server";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

/**
 * Match everything except Next static assets and common public files.
 * Adjust if you need to exclude more paths.
 */
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};

/** === Canonical host & HTTPS settings ===
 * Set CANONICAL_HOST in your env (e.g., "ticketpay.us.com" or "www.ticketpay.us.com").
 * Default below uses apex domain without www to align with most SMS links.
 */
const CANONICAL_HOST = (process.env.CANONICAL_HOST || "ticketpay.us.com").toLowerCase();

/** Upstash rate limit (falls back to in-memory if not configured) */
const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN })
    : null;

const ratelimit = redis ? new Ratelimit({ redis, limiter: Ratelimit.fixedWindow(60, "60s") }) : null;
const fallbackHits = new Map<string, { count: number; ts: number }>();

function addSecurityHeaders(res: NextResponse) {
  // 6 months HSTS; include subdomains; preload (only keep preload if you plan to submit to hstspreload.org)
  res.headers.set("Strict-Transport-Security", "max-age=15552000; includeSubDomains; preload");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  // Adjust CSP if you add external scripts/styles; keep simple for now
  res.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self' https:; frame-ancestors 'none'; base-uri 'self'; form-action 'self'"
  );
  // Lock down powerful APIs
  res.headers.set(
    "Permissions-Policy",
    "geolocation=(), microphone=(), camera=(), payment=(), usb=(), interest-cohort=()"
  );
  return res;
}

export async function middleware(req: NextRequest) {
  const url = req.nextUrl; // more robust than new URL(req.url) in middleware
  const isProd = process.env.NODE_ENV === "production";
  const currentHost = url.hostname.toLowerCase();

  // 1) Force HTTPS (Twilio requires secure links). On Vercel, check x-forwarded-proto.
  const proto = req.headers.get("x-forwarded-proto");
  if (isProd && proto && proto !== "https") {
    const httpsURL = new URL(url.toString());
    httpsURL.protocol = "https:";
    httpsURL.hostname = CANONICAL_HOST; // normalize host while we redirect
    httpsURL.port = "";
    const redirect = NextResponse.redirect(httpsURL, 308);
    return addSecurityHeaders(redirect);
  }

  // 2) Enforce canonical host (avoid www/non-www duplicates)
  if (isProd && currentHost !== CANONICAL_HOST) {
    const canonURL = new URL(url.toString());
    canonURL.hostname = CANONICAL_HOST;
    canonURL.port = "";
    const redirect = NextResponse.redirect(canonURL, 308);
    return addSecurityHeaders(redirect);
  }

  // 3) API rate limiting
  if (url.pathname.startsWith("/api/")) {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "local";

    if (ratelimit) {
      const res = await ratelimit.limit(ip);
      if (!res.success) {
        return new NextResponse("Rate limit", { status: 429 });
      }
    } else {
      const now = Date.now();
      const rec = fallbackHits.get(ip) || { count: 0, ts: now };
      if (now - rec.ts > 60_000) {
        rec.count = 0;
        rec.ts = now;
      }
      rec.count++;
      fallbackHits.set(ip, rec);
      if (rec.count > 60) {
        return new NextResponse("Rate limit", { status: 429 });
      }
    }
  }

  // 4) Pass through + add security headers to all responses
  const res = NextResponse.next();
  return addSecurityHeaders(res);
}