import sgMail from "@sendgrid/mail";

const RAW = process.env.SENDGRID_API_KEY || "";
const KEY = RAW.trim();
if (KEY) sgMail.setApiKey(KEY);

// Trim all email-related envs to avoid newline/space issues
const FROM_EMAIL = (process.env.EMAIL_FROM_ADDRESS || "info@ticketpay.us.com").trim();
const FROM_NAME  = (process.env.EMAIL_FROM_NAME || "TicketPay").trim();
const REPLY_EMAIL = (process.env.EMAIL_REPLY_TO_ADDRESS || FROM_EMAIL).trim();
const TO_OVERRIDE = (process.env.EMAIL_TO_OVERRIDE || "").trim();

export async function sendSubscribeConfirmEmail(to: string, plate?: string, state?: string) {
  if (!KEY) {
    console.error("sendgrid.missing_key");
    return { skipped: true, reason: "SENDGRID_API_KEY missing" };
  }

  const subject = `You’re subscribed to TicketPay alerts${plate && state ? ` for ${plate} (${state})` : ""}`;
  const html = `
    <div style="font-family:Inter,system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;line-height:1.55;color:#111;max-width:560px">
      <h2 style="margin:0 0 8px 0">Welcome to TicketPay</h2>
      <p>You’ll receive notifications when new parking tickets are posted${plate && state ? ` for <b>${plate} (${state})</b>` : ""}.</p>
      <p style="font-size:14px;color:#555;margin:12px 0">
        Manage alerts anytime at <a href="https://ticketpay.us.com/manage">ticketpay.us.com/manage</a>.
        No spam. No sharing your info.
      </p>
      <p style="font-size:12px;color:#777;margin:16px 0 0">
        Need help? Reply to this email or visit <a href="https://ticketpay.us.com/support">Support</a>.
      </p>
      <hr style="border:none;border-top:1px solid #eee;margin:16px 0" />
      <p style="font-size:12px;color:#777">© TicketPay • San Francisco, CA</p>
    </div>
  `;

  const msg = {
    to: TO_OVERRIDE || to,
    from: { email: FROM_EMAIL, name: FROM_NAME },
    replyTo: { email: REPLY_EMAIL, name: FROM_NAME },
    subject,
    html,
    headers: {
      "X-Original-Recipient": to,
      "List-Unsubscribe": "<https://ticketpay.us.com/manage>",
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
  } as Parameters<typeof sgMail.send>[0];

  const [res] = await sgMail.send(msg);
  return { messageId: res.headers["x-message-id"] || res.headers["x-message-id".toLowerCase()] };
}