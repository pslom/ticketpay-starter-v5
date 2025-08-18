// src/app/api/unsub/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";

/** Build the target URL (preserves query string) */
function targetURL(req: NextRequest) {
  const u = new URL(req.url);
  u.pathname = "/api/unsubscribe";
  return u.toString();
}

export async function OPTIONS(req: NextRequest) {
  // Pass through to the canonical route for consistent CORS handling
  const r = await fetch(targetURL(req), { method: "OPTIONS", cache: "no-store" });
  const body = await r.text();
  return new NextResponse(body, { status: r.status, headers: { "content-type": "application/json" } });
}

export async function GET(req: NextRequest) {
  const r = await fetch(targetURL(req), {
    method: "GET",
    headers: { "content-type": "application/json" },
    cache: "no-store",
  });
  const body = await r.text();
  return new NextResponse(body, { status: r.status, headers: { "content-type": "application/json" } });
}

export async function POST(req: NextRequest) {
  const r = await fetch(targetURL(req), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: await req.text(), // forward raw body
    cache: "no-store",
  });
  const body = await r.text();
  return new NextResponse(body, { status: r.status, headers: { "content-type": "application/json" } });
}
