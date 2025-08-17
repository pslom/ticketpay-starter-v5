import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};

const CANONICAL_HOST = (process.env.CANONICAL_HOST || "ticketpay.us.com").toLowerCase();
const ENFORCE_CANONICAL = (process.env.ENFORCE_CANONICAL ?? "false").toLowerCase() === "true";

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
  // TEMP: no CSP until we add nonces; avoids blocking Next.js scripts
  // res.headers.set("Content-Security-Policy", "...");
  res.headers.set("Permissions-Policy", "geolocation=(), microphone=(), camera=(), payment=(), usb=(), interest-cohort=()");
  return res;
}

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const isProd = process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production";

  // Optional protection bypass
  const bypassSecret = process.env.VERCEL_PROTECTION_BYPASS;
  const bypassHeader = req.headers.get("x-vercel-protection-bypass") ?? url.searchParams.get("_bypass");
  if (bypassSecret && bypassHeader && bypassHeader === bypassSecret) {
    return NextResponse.next();
  }

  const rawHost = (req.headers.get("x-forwarded-host") || req.headers.get("host") || url.hostname || "")
    .split(":")[0]
    .toLowerCase();

  const proto = (req.headers.get("x-forwarded-proto") || "").toLowerCase();

  // 1) Force HTTPS only if proto says not https (don’t change host here)
  if (isProd && proto && proto !== "https") {
    const httpsURL = new URL(url.toString());
    httpsURL.protocol = "https:";
    httpsURL.hostname = rawHost || httpsURL.hostname;
    httpsURL.port = "";
    const redirect = NextResponse.redirect(httpsURL.toString(), 308);
    redirect.headers.set("X-Req-Host", rawHost);
    redirect.headers.set("X-Canonical-Host", CANONICAL_HOST);
    redirect.headers.set("X-Proto", proto);
    return addSecurityHeaders(redirect);
  }

  // 2) Canonical host redirect — DISABLED by default to avoid loops.
  if (isProd && ENFORCE_CANONICAL && rawHost && rawHost !== CANONICAL_HOST) {
    const canonURL = new URL(url.toString());
    canonURL.hostname = CANONICAL_HOST;
    canonURL.protocol = "https:";
    canonURL.port = "";
    const redirect = NextResponse.redirect(canonURL.toString(), 308);
    redirect.headers.set("X-Req-Host", rawHost);
    redirect.headers.set("X-Canonical-Host", CANONICAL_HOST);
    redirect.headers.set("X-Proto", proto);
    return addSecurityHeaders(redirect);
  }

  // 3) API rate limiting
  if (url.pathname.startsWith("/api/")) {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "local";
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

  // 4) Pass through with headers + debug
  const res = NextResponse.next();
  res.headers.set("X-Req-Host", rawHost);
  res.headers.set("X-Canonical-Host", CANONICAL_HOST);
  res.headers.set("X-Proto", proto || "n/a");
  return addSecurityHeaders(res);
}