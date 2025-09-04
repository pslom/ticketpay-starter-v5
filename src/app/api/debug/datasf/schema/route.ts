export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";

const DATASET = process.env.DATASF_DATASET_ID || process.env.datasf_dataset_ID || "";
const TOKEN = process.env.DATASF_APP_TOKEN || process.env.datasf_app_token || "";

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
  const url = `https://data.sfgov.org/api/views/${DATASET}.json`;
  const r = await fetchWithFallback(url);
  const status = r.status;
  let body: any = null;
  try { body = await r.json(); } catch { body = await r.text(); }
  const ok = r.ok;
  const columns = Array.isArray((body as any)?.columns) ? (body as any).columns.map((c: any) => ({ name: c.fieldName, type: c.dataTypeName })) : [];
  return NextResponse.json({
    ok, status, dataset: DATASET,
    columns,
    body_hint: Array.isArray((body as any)?.columns) ? "columns returned" : (typeof body === "string" ? body.slice(0,200) : body)
  });
}
