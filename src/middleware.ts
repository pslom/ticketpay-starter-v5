import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

/**
 * Match everything except Next static assets and common public files.
 */
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};

/** Canonical host (set in Vercel env as CANONICAL_HOST if needed) */
const CANONICAL_HOST = (process.env.CANONICAL_HOST || "ticketpay.us.com").toLowerCase();

/** Upstash rate limiter (falls back to in-memory) */
const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN })
    : null;

const ratelimit = redis ? new Ratelimit({ redis, limiter: Ratelimit.fixedWindow(60, "60s") }) : null;
const fallbackHits = new Map<string, { count: number; ts: number }>();

function addSecurityHeaders(res: NextResponse) {
  res.headers.set("Strict-Transport-Security", "max-age=15552000; includeSubDomains; preload");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // TEMP: disable CSP to avoid breaking Next.js dev/hydration.
  // Reintroduce later with proper nonces.
  // res.headers.set(
  //   "Content-Security-Policy",
  //   "default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self' https:; frame-ancestors 'none'; base-uri 'self'; form-action 'self'"
  // );

  res.headers.set("Permissions-Policy", "geolocation=(), microphone=(), camera=(), payment=(), usb=(), interest-cohort=()");
  return res;
}

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const isProd = process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production";

  // Bypass support (optional)
  const bypassSecret = process.env.VERCEL_PROTECTION_BYPASS;
  const bypassHeader = req.headers.get("x-vercel-protection-bypass") ?? url.searchParams.get("_bypass");
  if (bypassSecret && bypassHeader && bypassHeader === bypassSecret) {
    return NextResponse.next();
  }

  // Normalize the incoming host (strip port)
  const rawHost = (req.headers.get("x-forwarded-host") || req.headers.get("host") || url.hostname || "").split(":")[0].toLowerCase();

  // 1) Force HTTPS in production if x-forwarded-proto says non-https.
  const proto = (req.headers.get("x-forwarded-proto") || "").toLowerCase();
  if (isProd && proto && proto !== "https") {
    const httpsURL = new URL(url.toString());
    httpsURL.protocol = "https:";
    // keep the same host here to avoid host churn/loops
    httpsURL.hostname = rawHost || httpsURL.hostname;
    httpsURL.port = "";
    const redirect = NextResponse.redirect(httpsURL.toString(), 308);
    return addSecurityHeaders(redirect);
  }

  // 2) Enforce canonical host only when it truly differs
  if (isProd && rawHost && rawHost !== CANONICAL_HOST) {
    const canonURL = new URL(url.toString());
    canonURL.hostname = CANONICAL_HOST;
    canonURL.protocol = "https:";
    canonURL.port = "";
    const redirect = NextResponse.redirect(canonURL.toString(), 308);
    return addSecurityHeaders(redirect);
  }

  // 3) API rate limiting (Upstash or in-memory)
  if (url.pathname.startsWith("/api/")) {
    const ip = (req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "local");

    if (ratelimit) {
      const r = await ratelimit.limit(ip);
      if (!r.success) return new NextResponse("Rate limit", { status: 429 });
    } else {
      const now = Date.now();
      const rec = fallbackHits.get(ip) || { count: 0, ts: now };
      if (now - rec.ts > 60_000) {
        rec.count = 0;
        rec.ts = now;
      }
      rec.count++;
      fallbackHits.set(ip, rec);
      if (rec.count > 60) return new NextResponse("Rate limit", { status: 429 });
    }
  }

  // 4) Pass through and add security headers
  const res = NextResponse.next();
  return addSecurityHeaders(res);
}