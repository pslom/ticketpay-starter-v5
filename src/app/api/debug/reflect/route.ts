export const runtime = "nodejs";
import { NextResponse } from "next/server";
import crypto from "node:crypto";

function getIncomingToken(req: Request): string {
  const url = new URL(req.url);
  const q = (url.searchParams.get("token") || "").trim();
  if (q) return q;
  const h = (req.headers.get("x-debug-token") || "").trim();
  if (h) return h;
  const auth = (req.headers.get("authorization") || "").trim();
  if (auth.toLowerCase().startsWith("bearer ")) return auth.slice(7).trim();
  return "";
}

export async function GET(req: Request) {
  const tok = getIncomingToken(req);
  const sha256 = tok ? crypto.createHash("sha256").update(tok).digest("hex") : null;
  const b64 = tok ? Buffer.from(tok, "utf8").toString("base64") : null;
  return NextResponse.json({
    ok: true,
    present: !!tok,
    len: tok.length,
    sha256,
    b64, // base64 of the incoming token, useful to spot hidden spaces/newlines
  });
}
