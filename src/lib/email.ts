import sgMail from "@sendgrid/mail";

const FROM_EMAIL = process.env.MAIL_FROM_EMAIL || "info@ticketpay.us.com";
const FROM_NAME = process.env.MAIL_FROM_NAME || "TicketPay";
const REPLY_TO = process.env.MAIL_REPLY_TO || FROM_EMAIL;

function ensureConfigured() {
  const key = process.env.SENDGRID_API_KEY || "";
  if (!key) throw new Error("SENDGRID_API_KEY missing");
  sgMail.setApiKey(key);
}

export async function sendEmail(to: string, subject: string, html: string, text?: string) {
  ensureConfigured();
  const msg: any = {
    to,
    from: { email: FROM_EMAIL, name: FROM_NAME },
    replyTo: REPLY_TO,
    subject,
    text: text || html.replace(/<[^>]+>/g, ""),
    html,
  };
  // Allow upstream to set unsubscribe headers via process.env for now
  const listUnsub = process.env.LIST_UNSUB_URL;
  if (listUnsub) {
    msg.headers = msg.headers || {};
    msg.headers["List-Unsubscribe"] = `<${listUnsub}>, <mailto:${FROM_EMAIL}?subject=unsubscribe>`;
    msg.headers["List-Unsubscribe-Post"] = "List-Unsubscribe=One-Click";
  }
  const [resp] = await sgMail.send(msg);
  return { ok: resp.statusCode >= 200 && resp.statusCode < 300, status: resp.statusCode };
}