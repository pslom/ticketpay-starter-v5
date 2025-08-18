import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};

// Keep these together (no wrapped lines)
const CANONICAL_HOST = (process.env.CANONICAL_HOST || "ticketpay.us.com").toLowerCase();
const ENFORCE_CANONICAL = (process.env.ENFORCE_CANONICAL ?? "false").toLowerCase() === "true";
const ADMIN_TOKEN = (process.env.ADMIN_TOKEN || "").trim();

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN })
    : null;

const ratelimit = redis ? new Ratelimit({ redis, limiter: Ratelimit.fixedWindow(60, "60s") }) : null;
const fallbackHits = new Map<string, { count: number; ts: number }>();

function addSecurityHeaders(res: NextResponse) {
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  // TEMP: no CSP until we add nonces; avoids blocking Next.js scripts
  // res.headers.set("Content-Security-Policy", "...");
  res.headers.set("Permissions-Policy", "geolocation=(), microphone=(), camera=(), payment=(), usb=(), interest-cohort=()");
  return res;
}

const DEV = process.env.NODE_ENV !== "production";

// Per-route buckets
const RATE_BUCKETS = {
  lookup: { limit: 30, windowMs: 60_000 },      // 30 per 60s
  subscribe: { limit: 10, windowMs: 5 * 60_000 }, // 10 per 5m
  preview: { limit: 3, windowMs: 60_000 },      // 3 per 60s
} as const;

// If you already have `redis` from Upstash, build per-bucket ratelimiters
const upstashLimiters = redis
  ? {
      lookup: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(RATE_BUCKETS.lookup.limit, "60 s"), prefix: "rl:lookup" }),
      subscribe: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(RATE_BUCKETS.subscribe.limit, "5 m"), prefix: "rl:subscribe" }),
      preview: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(RATE_BUCKETS.preview.limit, "60 s"), prefix: "rl:preview" }),
    }
  : null;

// In-memory fallback maps per bucket
const memBuckets: Record<keyof typeof RATE_BUCKETS, Map<string, { count: number; ts: number }>> = {
  lookup: new Map(),
  subscribe: new Map(),
  preview: new Map(),
};

function addRateHeaders(res: NextResponse, limit: number, remaining: number, retryAfterSec?: number) {
  res.headers.set("X-RateLimit-Limit", String(limit));
  res.headers.set("X-RateLimit-Remaining", String(Math.max(0, remaining)));
  if (retryAfterSec != null) res.headers.set("Retry-After", String(Math.max(0, Math.ceil(retryAfterSec))));
  return res;
}

async function checkRate(name: keyof typeof RATE_BUCKETS, key: string) {
  const cfg = RATE_BUCKETS[name];

  // Upstash branch
  if (upstashLimiters) {
    const r = await upstashLimiters[name].limit(key);
    // r has: success, limit, remaining, reset (epoch seconds)
    const nowSec = Math.floor(Date.now() / 1000);
    const retryAfter = r.success ? undefined : Math.max(0, (r.reset ?? nowSec) - nowSec);
    return { ok: r.success, limit: r.limit, remaining: r.remaining, retryAfter };
  }

  // In-memory fallback
  const now = Date.now();
  const bucket = memBuckets[name];
  const rec = bucket.get(key) || { count: 0, ts: now };
  if (now - rec.ts >= cfg.windowMs) {
    rec.count = 0;
    rec.ts = now;
  }
  rec.count++;
  bucket.set(key, rec);

  const remaining = Math.max(0, cfg.limit - rec.count);
  const ok = rec.count <= cfg.limit;
  const retryAfter = ok ? undefined : Math.ceil((rec.ts + cfg.windowMs - now) / 1000);
  return { ok, limit: cfg.limit, remaining, retryAfter };
}

export async function middleware(req: NextRequest) {
  const url = new URL(req.url);

  // === Admin routes guard (runs early) ===
  if (url.pathname.startsWith("/api/admin/")) {
    const authHeader = req.headers.get("authorization") || "";
    const bearer = authHeader.replace(/^Bearer\s+/i, "");
    const headerAlt = req.headers.get("x-admin-token") || "";
    const ok = ADMIN_TOKEN && (bearer === ADMIN_TOKEN || headerAlt === ADMIN_TOKEN);

    if (!ok) {
      const res = new NextResponse(JSON.stringify({ ok: false, error: "unauthorized" }), {
        status: 401,
        headers: { "content-type": "application/json" },
      });
      return addSecurityHeaders(res);
    }
  }

  const rawHost = (req.headers.get("x-forwarded-host") || req.headers.get("host") || url.hostname || "")
    .split(":")[0]
    .toLowerCase();

  const proto = (req.headers.get("x-forwarded-proto") || "").toLowerCase();

  // 1) Force HTTPS in production only, and only if proto says not https (don’t change host here)
  if (!DEV && proto && proto !== "https") {
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
  if (ENFORCE_CANONICAL && rawHost && rawHost !== CANONICAL_HOST) {
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
  if (ratelimit) {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      || req.headers.get("x-real-ip")
      || "local";
    const r = await ratelimit.limit(ip);
    if (!r.success) {
      return addSecurityHeaders(new NextResponse("Rate limit", { status: 429 }));
    }
  } else {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      || req.headers.get("x-real-ip")
      || "local";
    const now = Date.now();
    const rec = fallbackHits.get(ip) || { count: 0, ts: now };
    if (now - rec.ts > 60_000) {
      rec.count = 0;
      rec.ts = now;
    }
    rec.count++;
    fallbackHits.set(ip, rec);
    if (rec.count > 60) {
      return addSecurityHeaders(new NextResponse("Rate limit", { status: 429 }));
    }
  }

  // Skip limits in dev
  if (!DEV) {
    // Identify client key
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "local";

    // Route-specific limits
    if (url.pathname.startsWith("/api/lookup")) {
      const r = await checkRate("lookup", ip);
      if (!r.ok) {
        const res = addRateHeaders(new NextResponse("Rate limit", { status: 429 }), r.limit, r.remaining, r.retryAfter);
        return addSecurityHeaders(res);
      }
    } else if (url.pathname.startsWith("/api/subscribe")) {
      const r = await checkRate("subscribe", ip);
      if (!r.ok) {
        const res = addRateHeaders(new NextResponse("Rate limit", { status: 429 }), r.limit, r.remaining, r.retryAfter);
        return addSecurityHeaders(res);
      }
    } else if (url.pathname.startsWith("/api/preview")) {
      const r = await checkRate("preview", ip);
      if (!r.ok) {
        const res = addRateHeaders(new NextResponse("Rate limit", { status: 429 }), r.limit, r.remaining, r.retryAfter);
        return addSecurityHeaders(res);
      }
    }
  }

  // 4) Pass through with headers + debug
  const res = NextResponse.next();
  res.headers.set("X-Canonical-Host", CANONICAL_HOST);
  res.headers.set("X-Proto", proto || "n/a");
  return addSecurityHeaders(res);
}
