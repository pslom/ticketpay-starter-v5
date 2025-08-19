export type EmailArgs = {
  channel: "email";
  to: string;
  subject: string;
  text: string;
  html?: string;
  listUnsubUrl?: string;
};

export type SmsArgs = {
  channel: "sms";
  to: string;
  text: string;
};

export type NotifyArgs = EmailArgs | SmsArgs;

export function createNotifier() {
  const hasResend = !!process.env.RESEND_API_KEY;
  const hasSendgrid = !!process.env.SENDGRID_API_KEY;

  const FROM_NAME = process.env.MAIL_FROM_NAME || "TicketPay";
  const FROM_EMAIL = process.env.MAIL_FROM_EMAIL || "info@ticketpay.us.com";
  const REPLY_TO = process.env.MAIL_REPLY_TO || FROM_EMAIL;

  async function sendEmail(to: string, subject: string, html: string, text: string, listUnsubUrl?: string) {
    const fromFormatted = `${FROM_NAME} <${FROM_EMAIL}>`;
    const headers: Record<string, string> = {};

    if (listUnsubUrl) {
      headers["List-Unsubscribe"] = `<${listUnsubUrl}>, <mailto:${FROM_EMAIL}?subject=unsubscribe>`;
      headers["List-Unsubscribe-Post"] = "List-Unsubscribe=One-Click";
    }

    if (hasResend) {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY!);
      // Cast to any to allow reply_to and headers regardless of SDK type version
      const payload: any = {
        from: fromFormatted,
        to,
        subject,
        html,
        text,
        reply_to: REPLY_TO,
        headers,
      };
      await resend.emails.send(payload as any);
      return { ok: true };
    }

    if (hasSendgrid) {
      const sg = (await import("@sendgrid/mail")).default;
      sg.setApiKey(process.env.SENDGRID_API_KEY!);
      await sg.send({
        to,
        from: { name: FROM_NAME, email: FROM_EMAIL },
        replyTo: REPLY_TO,
        subject,
        text,
        html,
        headers
      } as any);
      return { ok: true };
    }

    console.warn("No email provider configured; skipped send.");
    return { ok: false };
  }

  async function sendSMS(_to: string, _text: string) {
    // Wire Twilio later
    return { ok: false };
  }

  return {
    async notify(args: NotifyArgs) {
      if (args.channel === "sms") {
        return sendSMS(args.to, args.text);
      }
      const html = args.html ?? `<pre>${escapeHtml(args.text)}</pre>`;
      return sendEmail(args.to, args.subject, html, args.text, args.listUnsubUrl);
    },
  };
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}
