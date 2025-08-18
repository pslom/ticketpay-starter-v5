import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/optin";
import { Redis } from "@upstash/redis";
import crypto from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Optional Upstash Redis for replay protection
const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN })
    : null;

// In-memory fallback map of used tokens -> expiresAt (ms)
const usedTokenMem = new Map<string, number>();
const USED_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token");
    if (!token) {
      return NextResponse.json({ ok: false, error: "missing_token" }, { status: 400 });
    }

    // Validate and decode opt-in token
    let d: ReturnType<typeof verifyToken>;
    try {
      d = verifyToken(token);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      const status = msg === "expired" || msg === "bad_token" || msg === "bad_sig" ? 400 : 500;
      return NextResponse.json({ ok: false, error: msg }, { status });
    }

    // Prevent token reuse (best-effort)
    const key = "optin:used:" + crypto.createHash("sha256").update(token).digest("hex");
    if (redis) {
      // NX + EX => set only if not exists; expire automatically
      const set = await redis.set(key, "1", { nx: true, ex: USED_TTL_SECONDS });
      if (!set) {
        return NextResponse.json({ ok: false, error: "token_already_used" }, { status: 409 });
      }
    } else {
      const now = Date.now();
      // prune occasionally
      if (usedTokenMem.size > 1000) {
        for (const [k, exp] of usedTokenMem) if (exp <= now) usedTokenMem.delete(k);
      }
      const exp = usedTokenMem.get(key);
      if (exp && exp > now) {
        return NextResponse.json({ ok: false, error: "token_already_used" }, { status: 409 });
      }
      usedTokenMem.set(key, now + USED_TTL_SECONDS * 1000);
    }

    // Prefer the current request origin to ensure same-deployment call
    const origin = req.nextUrl.origin || process.env.BASE_URL || "http://127.0.0.1:3000";
    const r = await fetch(`${origin}/api/subscribe`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        plate: d.plate,
        state: d.state,
        city: d.city || "",
        channel: d.channel,
        value: d.value,
      }),
      cache: "no-store",
    });
    const j = (await r.json().catch(() => ({}))) as { ok?: boolean; error?: string };
    if (!r.ok || !j?.ok) {
      const status = r.status && r.status !== 200 ? r.status : 502;
      return NextResponse.json({ ok: false, error: j?.error || `subscribe_failed_${r.status || "unknown"}` }, { status });
    }

    return NextResponse.json({ ok: true, plate: d.plate, state: d.state, channel: d.channel, value: d.value });
  } catch (e: unknown) {
    const err = e instanceof Error ? e : new Error(String(e));
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
