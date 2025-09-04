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
  const url = new URL(`https://data.sfgov.org/resource/${DATASET}.json`);
  url.searchParams.set("$select", "vehicle_plate,vehicle_plate_state,citation_number,citation_issued_datetime,date_added,:id");
  url.searchParams.set("$order", ":id desc");
  url.searchParams.set("$limit", "5");

  const r = await fetchWithFallback(url.toString());
  const status = r.status;
  let rows: any[] = [];
  try { rows = await r.json(); } catch { /* ignore */ }

  return NextResponse.json({ ok: r.ok, status, count: Array.isArray(rows) ? rows.length : 0, rows });
}
