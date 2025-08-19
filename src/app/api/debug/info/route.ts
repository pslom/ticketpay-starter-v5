export const runtime = "nodejs";

import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { getIncomingToken, getExpectedToken } from "../_util/token";

function hash(s: string) {
  return crypto.createHash("sha256").update(s).digest("hex");
}

function dbHostFrom(url?: string | null): string | null {
  if (!url) return null;
  try {
    // WHATWG URL handles postgresql:, normalize postgres: → postgresql:
    const u = new URL(url.replace(/^postgres:/, "postgresql:"));
    return u.hostname || null;
  } catch {
    // Fallback regex, still only returns host
    const m = url.match(/@([^:/?#]+)(?::\d+)?\//);
    return m?.[1] ?? null;
  }
}

export async function GET(req: Request) {
  const incoming = getIncomingToken(req);
  const expected = getExpectedToken();

  if (!expected || incoming !== expected) {
    // Keep even the “safe” info behind the token to avoid reconnaissance.
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }

  const dbgToken = (process.env.DEBUG_TOKEN || "").trim();
  const canon = (process.env.CANONICAL_HOST || "").trim();
  const enforce = (process.env.ENFORCE_CANONICAL || "").trim().toLowerCase() === "true";
  const dbUrl = process.env.DATABASE_URL || null;

  const caInline = !!(process.env.SUPABASE_CA_PEM || "").trim();
  const caFileVar = (process.env.SUPABASE_CA_PEM_FILE || "").trim();
  const allowSelf = (process.env.ALLOW_SELF_SIGNED_TLS || "").trim() === "1";

  return NextResponse.json({
    ok: true,
    node_env: process.env.NODE_ENV || null,
    canonical_host: canon || null,
    enforce_canonical: enforce,
    token: {
      present: !!dbgToken,
      len: dbgToken.length,
      sha256: dbgToken ? hash(dbgToken) : null,
    },
    db: {
      host: dbHostFrom(dbUrl),
      present: !!dbUrl,
    },
    tls: {
      allow_self_signed: allowSelf,
      ca_inline: caInline,
      ca_file_var: caFileVar || null,
    },
  });
}
