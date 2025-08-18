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
  const from = process.env.SENDGRID_FROM || process.env.EMAIL_FROM_ADDRESS; // fallback supported
  if (!key || !from) {
    return { ok: false, skipped: true, reason: 'sendgrid_env_missing' };
  }

  const body = {
    personalizations: [{ to: [{ email: to }] }],
    from: { email: from },
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
  const from = process.env.TWILIO_PHONE_NUMBER;
  if (!sid || !token || !from) {
    return { ok: false, skipped: true, reason: 'twilio_env_missing' };
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
