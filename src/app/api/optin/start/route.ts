import { NextRequest, NextResponse } from "next/server";
import { makeToken, PendingPayload } from "@/lib/optin";
import { createNotifier } from "@/lib/notifier";

const BASE_URL = process.env.BASE_URL || "https://ticketpay.us.com";

const notifier = createNotifier();

import { sendSms } from '@/lib/sms';
import { confirmSms, plateBadge } from '@/lib/smsTemplates';

export async function POST(req: NextRequest) {
  try {
    const b = (await req.json()) as Partial<PendingPayload>;
    const plate = String(b.plate || "").toUpperCase().trim();
    const state = String(b.state || "").toUpperCase().trim();
    const city  = String(b.city || "").trim();
    const channel = b.channel === "sms" ? "sms" : "email";
    const value = String(b.value || "").trim();

    if (!plate || !state || !value) return Response.json({ ok: false, error: "missing_fields" }, { status: 400 });

    const token = makeToken({ plate, state, city, channel, value });
    const confirmUrl = `${BASE_URL}/optin/confirm?token=${encodeURIComponent(token)}`;

  if (channel === "email") {
      const html = `
        <div style="font-family:system-ui,Segoe UI,Arial">
          <h2>Confirm TicketPay alerts</h2>
          <p>Confirm alerts for plate <b>${plate}</b> (${state}) in San Francisco.</p>
          <p><a href="${confirmUrl}" style="display:inline-block;padding:10px 14px;background:#000;color:#fff;border-radius:10px;text-decoration:none">Confirm alerts</a></p>
      <p style="font-size:12px;color:#666">If you didn’t request this, ignore this email.</p>
      <p style="font-size:12px;color:#666;margin-top:16px">Questions? Reply to this email and we’ll help: ${process.env.MAIL_REPLY_TO || process.env.MAIL_FROM_EMAIL || "info@ticketpay.us.com"}</p>
        </div>`;
    await notifier.notify({ channel: "email", to: value, subject: "Confirm TicketPay alerts", text: "Confirm TicketPay alerts", html, listUnsubUrl: `${BASE_URL}/unsubscribe` }).catch(()=>{});
    } else {
      const badge = plateBadge(state, plate);
      await sendSms(value, confirmSms(badge));
    }

    return Response.json({ ok: true, confirm_url: confirmUrl });
  } catch (e: unknown) {
    const err = e instanceof Error ? e : new Error(String(e));
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
