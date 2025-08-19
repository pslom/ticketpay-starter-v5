// src/lib/notify.ts

// Using global fetch provided by Next.js runtime

// Send Email via SendGrid
export async function sendEmail(
  to: string,
  subject: string,
  text: string,
  html?: string
) {
  const key = process.env.SENDGRID_API_KEY;
  // Prefer configured FROM; fall back to branded default which matches our authenticated domain
  const from = process.env.SENDGRID_FROM || process.env.EMAIL_FROM_ADDRESS || "info@ticketpay.us.com";
  if (!key || !from) {
    return { ok: false, skipped: true as const, reason: 'sendgrid_env_missing' };
  }

  const fromName = process.env.EMAIL_FROM_NAME || process.env.SENDGRID_FROM_NAME || 'TicketPay';
  const body = {
    personalizations: [{ to: [{ email: to }] }],
    from: fromName ? { email: from, name: fromName } : { email: from },
    subject,
    content: [
      { type: 'text/plain', value: text },
      ...(html ? [{ type: 'text/html', value: html }] : []),
    ],
  };

  const r = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${key}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  return { ok: r.status >= 200 && r.status < 300, status: r.status };
}

// Send SMS via Twilio
export async function sendSms(to: string, body: string) {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM; // align with rest of codebase
  if (!sid || !token || !from) {
    return { ok: false, skipped: true as const, reason: 'twilio_env_missing' };
  }

  const r = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString(
          'base64'
        )}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ To: to, From: from, Body: body }).toString(),
    }
  );

  return { ok: r.status >= 200 && r.status < 300, status: r.status };
}

// Preview helpers expected by routes
export async function sendEmailPreview(to: string) {
  const subject = 'TicketPay — example alert';
  const text = 'TicketPay: New ticket — $65 · No Parking · Mission & 16th. Pay: https://example.invalid';
  const html = `<p>${text}</p>`;
  return sendEmail(to, subject, text, html);
}

export async function sendSmsPreview(to: string) {
  const body = 'TicketPay: New ticket — $65 · No Parking · Mission & 16th. Pay: https://example.invalid';
  return sendSms(to, body);
}

// Notifier factory expected by core route
type NotifyParams =
  | { channel: 'email'; to: string; subject: string; text: string; html?: string }
  | { channel: 'sms'; to: string; text: string };

export function createNotifier() {
  return {
    async notify(p: NotifyParams) {
      if (p.channel === 'email') {
        return sendEmail(p.to, p.subject, p.text, p.html);
      }
      return sendSms(p.to, p.text);
    },
  };
}
