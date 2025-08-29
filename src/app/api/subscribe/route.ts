export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase";
import { normalizeContact, hmacContact } from "@/lib/contact";
import { notifyOptIn } from "@/lib/messenger";

type Body = {
  state: string;
  plate: string;
  channel: "sms" | "email";
  contact: string;
};

function normalizePlate(v: string) {
  return v.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export async function POST(req: Request) {
  try {
    const s = getSupabaseServer();
    const b = (await req.json()) as Body;
    const state = String(b.state || "").toUpperCase().slice(0, 2);
    const plate = normalizePlate(String(b.plate || ""));
    const channel = b.channel === "sms" ? "sms" : "email";
    const contact = String(b.contact || "").trim();

    if (!/^[A-Z]{2}$/.test(state)) {
      return NextResponse.json({ ok: false, error: "invalid_state" }, { status: 400 });
    }
    if (!/^[A-Z0-9]{2,8}$/.test(plate)) {
      return NextResponse.json({ ok: false, error: "invalid_plate" }, { status: 400 });
    }
    const contact_norm = normalizeContact(channel, contact);
    if (channel === "sms" && !/^\+\d{11,15}$/.test(contact_norm)) {
      return NextResponse.json({ ok: false, error: "invalid_phone" }, { status: 400 });
    }
    if (channel === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact_norm)) {
      return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
    }
    const contact_hmac = hmacContact(contact_norm);

    const { data: existing } = await s
      .from("subscriptions")
      .select("id")
      .eq("plate", plate)
      .eq("state", state)
      .eq("contact_hmac", contact_hmac)
      .maybeSingle();

    if (existing?.id) {
      try { await notifyOptIn({ channel, contact, state, plate, subId: existing.id }); } catch {}
      return NextResponse.json({ ok: true, created: false, state, plate, channel });
    }

    const ins = await s.from("subscriptions").insert({
      plate,
      state,
      channel,
      contact,
      contact_norm,
      contact_hmac,
      last_checked_at: null,
    }).select('id').single();

    if (ins.error) {
      return NextResponse.json({ ok: false, error: ins.error.message }, { status: 500 });
    }

    const subId = ins.data?.id as string | undefined;
    try { await notifyOptIn({ channel, contact, state, plate, subId }); } catch {}
    return NextResponse.json({ ok: true, created: true, state, plate, channel });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}
