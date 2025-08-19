import sgMail from "@sendgrid/mail";

const FROM_EMAIL =
  process.env.SENDGRID_FROM ||
  process.env.EMAIL_FROM_ADDRESS ||
  "info@ticketpay.us.com";

const FROM_NAME = process.env.EMAIL_FROM_NAME || "TicketPay";

function ensureConfigured() {
  const key = process.env.SENDGRID_API_KEY || "";
  if (!key) throw new Error("SENDGRID_API_KEY missing");
  sgMail.setApiKey(key);
}

export async function sendEmail(to: string, subject: string, html: string, text?: string) {
  ensureConfigured();
  const msg = {
    to,
    from: { email: FROM_EMAIL, name: FROM_NAME },
    subject,
    text: text || html.replace(/<[^>]+>/g, ""),
    html,
  };
  const [resp] = await sgMail.send(msg);
  return { ok: resp.statusCode >= 200 && resp.statusCode < 300, status: resp.statusCode };
}