import sgMail from "@sendgrid/mail";
import twilio from "twilio";

type SendResult = { ok: boolean; skipped?: boolean; error?: string };

function stringifyError(err: unknown): string {
  if (err && typeof err === "object") {
    const obj = err as { message?: unknown; response?: { body?: unknown } };
    if (obj.response?.body !== undefined) {
      try { return JSON.stringify(obj.response.body); } catch { return String(obj.response.body); }
    }
    if (obj.message !== undefined) return String(obj.message);
  }
  try { return String(err); } catch { return "unknown_error"; }
}

export async function sendSms(to: string, body: string): Promise<SendResult> {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM;
  if (!sid || !token || !from) return { ok: false, skipped: true, error: "twilio_env_missing" };
  try {
    const client = twilio(sid, token);
    await client.messages.create({ from, to, body });
    return { ok: true };
  } catch (e: unknown) {
    return { ok: false, error: stringifyError(e) };
  }
}

export async function sendEmail(to: string, subject: string, html: string, text?: string): Promise<SendResult> {
  const key = process.env.SENDGRID_API_KEY;
  const from = process.env.SENDGRID_FROM;
  if (!key || !from) return { ok: false, skipped: true, error: "sendgrid_env_missing" };
  try {
    sgMail.setApiKey(key);
    await sgMail.send({ to, from, subject, html, text: text ?? html.replace(/<[^>]+>/g, " ") });
    return { ok: true };
  } catch (e: unknown) {
    return { ok: false, error: stringifyError(e) };
  }
}
