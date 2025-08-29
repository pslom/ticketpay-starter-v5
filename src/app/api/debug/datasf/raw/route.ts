export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";

const DATASET = process.env.datasf_dataset_ID || process.env.DATASF_DATASET_ID || "";
const TOKEN = process.env.datasf_app_token || process.env.DATASF_APP_TOKEN || "";

async function fetchWithFallback(url: string) {
  if (TOKEN) {
    const r = await fetch(url, { headers: { "X-App-Token": TOKEN }, cache: "no-store" });
    if (r.status !== 403) return r;
    try {
      const copy = r.clone();
      let txt = "";
      try { txt = JSON.stringify(await copy.json()); } catch { txt = await copy.text(); }
      if (/invalid app_token|permission_denied/i.test(txt)) {
        return fetch(url, { cache: "no-store" });
      }
    } catch {}
    return r;
  }
  return fetch(url, { cache: "no-store" });
}

export async function GET() {
  const url = `https://data.sfgov.org/resource/${DATASET}.json?$limit=1`;
  const r = await fetchWithFallback(url);
  const status = r.status;
  let body: any = null;
  try { body = await r.json(); } catch { body = await r.text(); }
  const ok = r.ok;
  const keys = Array.isArray(body) && body[0] ? Object.keys(body[0]) : [];
  return NextResponse.json({
    ok, status, dataset: DATASET, url,
    keys,
    body_hint: Array.isArray(body) ? `rows:${body.length}` : String(body).slice(0,200)
  });
}
