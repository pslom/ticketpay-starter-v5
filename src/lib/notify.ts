]// ========== Existing notifier + concrete providers (KEEP) ==========
type NotifyParams = { channel: 'email' | 'sms'; to: string; subject?: string; text: string; html?: string };

export type Notifier = {
  notify: (p: NotifyParams) => Promise<{ ok: boolean; status?: number; skipped?: boolean; reason?: string }>
}

export function createNotifier(): Notifier {
  async function notify(p: NotifyParams) {
    if (p.channel === 'email') return sendEmail(p.to, p.subject || 'TicketPay alert', p.text, p.html);
    if (p.channel === 'sms') return sendSMS(p.to, p.text);
    return { ok: false, skipped: true, reason: 'unknown_channel' };
  }
  return { notify };
}

async function sendEmail(to: string, subject: string, text: string, html?: string) {
  const key = process.env.SENDGRID_API_KEY;
  const from = process.env.SENDGRID_FROM;
  if (!key || !from) return { ok: false, skipped: true, reason: 'sendgrid_env_missing' };

  const body = {
    personalizations: [{ to: [{ email: to }] }],
    from: { email: from },
    subject,
    content: [{ type: 'text/plain', value: text }, ...(html ? [{ type: 'text/html', value: html }] : [])],
  };
  const r = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  return { ok: r.status >= 200 && r.status < 300, status: r.status };
}

async function sendSMS(to: string, body: string) {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM;
  if (!sid || !token || !from) return { ok: false, skipped: true, reason: 'twilio_env_missing' };

  const form = new URLSearchParams({ To: to, From: from, Body: body });
  const r = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: 'POST',
    headers: {
      authorization: 'Basic ' + Buffer.from(`${sid}:${token}`).toString('base64'),
      'content-type': 'application/x-www-form-urlencoded'
    },
    body: form.toString(),
  });
  return { ok: r.status >= 200 && r.status < 300, status: r.status };
}

export { sendEmail, sendSMS };

// ========== Preview helpers (ADD/KEEP) ==========
function previewCopy(): { subject: string; text: string; html: string; sms: string } {
  return {
    subject: "TicketPay — alert preview",
    text: "Heads up — this is a TicketPay preview. Example: 3 days left. Don’t let this one stick.",
    html: `
      <table width="100%" style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#111">
        <tr><td style="padding:0 0 8px 0">
          <h2 style="margin:0 0 8px 0">TicketPay alert preview</h2>
          <p style="margin:0 12px 12px 0">Here’s what a reminder looks like.</p>
          <div style="padding:12px;border:1px solid #e5e7eb;border-radius:10px">
            <strong>Heads up — 3 days left.</strong><br/>
            Don’t let this one stick. We’ll remind you again before the due date.
          </div>
          <p style="margin-top:16px;color:#6b7280;font-size:12px">You requested this preview from TicketPay.</p>
        </td></tr>
      </table>
    `.trim(),
    sms: "TicketPay preview: Heads up — example reminder (3 days left). Reply STOP to unsubscribe.",
  };
}

export async function sendEmailPreview(to: string): Promise<void> {
  const p = previewCopy();
  await sendEmail(to, p.subject, p.text, p.html);
}

export async function sendSmsPreview(to: string): Promise<void> {
  const p = previewCopy();
  await sendSMS(to, p.sms);
}
