type NotifyParams = { channel:'email'|'sms'; to:string; subject?:string; text:string; html?:string };

export async function notify(p: NotifyParams) {
  if (p.channel === 'email') return sendEmail(p.to, p.subject || 'TicketPay alert', p.text, p.html);
  if (p.channel === 'sms')   return sendSMS(p.to, p.text);
  return { ok:false, skipped:true, reason:'unknown_channel' };
}

async function sendEmail(to: string, subject: string, text: string, html?: string) {
  const key = process.env.SENDGRID_API_KEY;
  const from = process.env.SENDGRID_FROM;
  if (!key || !from) return { ok:false, skipped:true, reason:'sendgrid_env_missing' };

  const body = {
    personalizations: [{ to: [{ email: to }] }],
    from: { email: from },
    subject,
    content: [{ type: 'text/plain', value: text }, ...(html ? [{ type: 'text/html', value: html }] : [])],
  };
  const r = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: { 'authorization': `Bearer ${key}`, 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  return { ok: r.status >= 200 && r.status < 300, status: r.status };
}

async function sendSMS(to: string, body: string) {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM;
  if (!sid || !token || !from) return { ok:false, skipped:true, reason:'twilio_env_missing' };

  const form = new URLSearchParams({ To: to, From: from, Body: body });
  const r = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: 'POST',
    headers: { 'authorization': 'Basic ' + Buffer.from(`${sid}:${token}`).toString('base64'),
               'content-type': 'application/x-www-form-urlencoded' },
    body: form.toString(),
  });
  return { ok: r.status >= 200 && r.status < 300, status: r.status };
}
