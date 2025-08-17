import { NextRequest } from "next/server";
import { makeToken, PendingPayload } from "@/lib/optin";

const BASE_URL = process.env.BASE_URL || "https://ticketpay.us.com";
const FROM_EMAIL = process.env.FROM_EMAIL || "no-reply@ticketpay.us.com";

// Optional email send via Resend
async function sendEmail(to: string, subject: string, html: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
    body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
  }).catch(() => {});
}

// Optional SMS via Twilio
async function sendSMS(to: string, body: string) {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM || "";
  if (!sid || !token || !from) return;
  const auth = Buffer.from(`${sid}:${token}`).toString("base64");
  const form = new URLSearchParams({ To: to, From: from, Body: body });
  await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "content-type": "application/x-www-form-urlencoded" },
    body: form,
  }).catch(() => {});
}

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
        </div>`;
      await sendEmail(value, "Confirm TicketPay alerts", html);
    } else {
      const body = `TicketPay: Confirm alerts for ${plate} (${state}) in SF:\n${confirmUrl}\nReply STOP to opt out.`;
      await sendSMS(value, body);
    }

    return Response.json({ ok: true, confirm_url: confirmUrl });
  } catch (e: any) {
    return Response.json({ ok: false, error: e?.message || "server_error" }, { status: 500 });
  }
}
