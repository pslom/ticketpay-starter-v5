import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const FROM = process.env.EMAIL_FROM || "TicketPay <onboarding@resend.dev>";
const resend = apiKey ? new Resend(apiKey) : null;

export async function sendSubscribeConfirmEmail(to: string, plate?: string, state?: string) {
  if (!resend) return { skipped: true, reason: "RESEND_API_KEY missing" };

  const subj = `You’re subscribed to TicketPay alerts${plate && state ? ` for ${plate} (${state})` : ""}`;
  const html = `
    <div style="font-family:Inter,system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;line-height:1.5;color:#111">
      <h2 style="margin:0 0 8px 0">Welcome to TicketPay</h2>
      <p>You’ll receive notifications when new parking tickets are posted${plate && state ? ` for <b>${plate} (${state})</b>` : ""}.</p>
      <p style="font-size:14px;color:#555">No spam. No sharing your info. Reply STOP to SMS to opt out. You can also manage alerts at <a href="https://ticketpay.us.com/manage">ticketpay.us.com/manage</a>.</p>
      <hr style="border:none;border-top:1px solid #eee;margin:16px 0" />
      <p style="font-size:12px;color:#777">© TicketPay • San Francisco, CA</p>
    </div>
  `;
  const { data, error } = await resend.emails.send({ from: FROM, to, subject: subj, html });
  if (error) throw error;
  return data;
}