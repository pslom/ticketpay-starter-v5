import twilio from 'twilio';
import sg from '@sendgrid/mail';

// ----- SendGrid (Email) -----
if (process.env.SENDGRID_API_KEY) {
  sg.setApiKey(process.env.SENDGRID_API_KEY);
}

export async function sendEmail(opts: { to: string; subject: string; text: string }) {
  if (!process.env.SENDGRID_API_KEY) {
    console.warn('SENDGRID disabled: no SENDGRID_API_KEY set. Email skipped.', opts);
    return { ok: false, skipped: true };
  }
  const from = process.env.FROM_EMAIL || 'TicketPay <no-reply@ticketpay.us.com>';
  await sg.send({
    to: opts.to,
    from,
    subject: opts.subject,
    text: opts.text,
  });
  return { ok: true };
}

// ----- Twilio (SMS) -----
export async function sendSms(opts: { to: string; body: string }) {
  const sid = process.env.TWILIO_SID;
  const auth = process.env.TWILIO_AUTH;
  if (!sid || !auth) {
    console.warn('Twilio disabled: no TWILIO_SID/AUTH set. SMS skipped.', opts);
    return { ok: false, skipped: true };
  }
  const client = twilio(sid, auth);
  const base: any = { to: opts.to, body: opts.body };
  if (process.env.TWILIO_MSID) base.messagingServiceSid = process.env.TWILIO_MSID;
  else base.from = process.env.TWILIO_FROM!;
  await client.messages.create(base);
  return { ok: true };
}
