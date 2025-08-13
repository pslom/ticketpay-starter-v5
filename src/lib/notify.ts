import sgMail from "@sendgrid/mail";
import twilio from "twilio";

type SendResult = { ok: boolean; skipped?: boolean; error?: string };

export async function sendSms(to: string, body: string): Promise<SendResult> {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM;
  if (!sid || !token || !from) return { ok: false, skipped: true, error: "twilio_env_missing" };
  try {
    const client = twilio(sid, token);
    await client.messages.create({ from, to, body });
    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: String(e?.message || e) };
  }
}

export async function sendEmail(to: string, subject: string, html: string, text?: string): Promise<SendResult> {
  const key = process.env.SENDGRID_API_KEY;
  const from = process.env.SENDGRID_FROM;
  if (!key || !from) return { ok: false, skipped: true, error: "sendgrid_env_missing" };
  try {
    sgMail.setApiKey(key);
    await sgMail.send({ to, from, subject, html, text: text || html.replace(/<[^>]+>/g, " ") });
    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: String(e?.message || e) };
  }
}
