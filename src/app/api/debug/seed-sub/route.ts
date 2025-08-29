export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase";
import { normalizeContact, hmacContact } from "@/lib/contact";

function getDataset() {
  return process.env.datasf_dataset_ID || process.env.DATASF_DATASET_ID || "";
}
function getToken() {
  return process.env.datasf_app_token || process.env.DATASF_APP_TOKEN || "";
}
async function fetchWithFallback(url: string) {
  const t = getToken();
  if (t) {
    const r = await fetch(url, { headers: { "X-App-Token": t }, cache: "no-store" });
    if (r.status !== 403) return r;
    try { const x = await r.clone().text(); if (/invalid app_token|permission_denied/i.test(x)) return fetch(url, { cache: "no-store" }); } catch {}
    return r;
  }
  return fetch(url, { cache: "no-store" });
}

export async function POST() {
  try {
    const supabase = getSupabaseServer();
    const dataset = getDataset();
    if (!dataset) return NextResponse.json({ error: "Missing DataSF dataset id" }, { status: 500 });

    const url = new URL(`https://data.sfgov.org/resource/${dataset}.json`);
    url.searchParams.set("$select", "vehicle_plate,vehicle_plate_state,citation_number,citation_issued_datetime,date_added,:id");
    url.searchParams.set("$order", ":id desc");
    url.searchParams.set("$limit", "1");

    const res = await fetchWithFallback(url.toString());
    if (!res.ok) return NextResponse.json({ error: `DataSF ${res.status}` }, { status: 500 });
    const rows = await res.json();
    const first = Array.isArray(rows) && rows[0] || null;
    if (!first) return NextResponse.json({ error: "No sample rows from DataSF" }, { status: 404 });

    const plate = String(first.vehicle_plate || "").toUpperCase();
    const state = String(first.vehicle_plate_state || "").toUpperCase();

    const channel: "email" | "sms" = "email";
    const contact = "dev@example.com";
    const contact_norm = normalizeContact(channel, contact);
    const contact_hmac = hmacContact(contact_norm);

    const { data: existing } = await supabase
      .from("subscriptions").select("id")
      .eq("plate", plate).eq("state", state).maybeSingle();

    if (!existing) {
      const { error } = await supabase.from("subscriptions").insert({
        plate, state, channel, contact, contact_norm, contact_hmac, last_checked_at: null
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ seeded: { plate, state } });
  } catch (e:any) {
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 });
  }
}
