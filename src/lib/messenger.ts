import sg from '@sendgrid/mail';
import twilio from 'twilio';
import { createShort } from './short';
import { PAY_AT_SFMTA_URL } from './externals';
import { signMagic } from './magic';

if (process.env.SENDGRID_API_KEY) sg.setApiKey(process.env.SENDGRID_API_KEY);

function hasTwilio() {
  return !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_FROM);
}
function twilioClient() {
  return twilio(process.env.TWILIO_ACCOUNT_SID as string, process.env.TWILIO_AUTH_TOKEN as string);
}
function appOrigin() {
  return process.env.APP_BASE_ORIGIN || process.env.SHORT_BASE_ORIGIN || process.env.NEXT_PUBLIC_SITE_ORIGIN || 'http://localhost:3000';
}

export async function notifyNewTicket(args: {
  channel: 'sms'|'email';
  contact: string;
  state: string;
  plate: string;
  amount?: number;
  dueLabel?: string;
}) {
  const senderName = process.env.SENDER_NAME || 'TicketPay';
  const { shortUrl } = await createShort(PAY_AT_SFMTA_URL, 'pay');
  const plateLine = `${args.state.toUpperCase()} ${args.plate.toUpperCase()}`;

  if (args.channel === 'sms') {
    if (!hasTwilio()) { console.log('SMS noop', { to: args.contact, plateLine, shortUrl }); return; }
    const body = `${senderName}: New SFMTA ticket for ${plateLine}.${args.amount ? ` Amount $${args.amount}.` : ''}${args.dueLabel ? ` Due ${args.dueLabel}.` : ''} Pay at SFMTA: ${shortUrl} Reply STOP to opt out.`;
    await twilioClient().messages.create({ to: args.contact, from: process.env.TWILIO_FROM as string, body });
    return;
  }

  if (process.env.SENDGRID_API_KEY && process.env.EMAIL_FROM) {
    const subject = `New SFMTA ticket for ${plateLine}${args.dueLabel ? ` — pay by ${args.dueLabel}` : ''}`;
    const html = `
      <div style="font-family:Inter,system-ui,Arial,sans-serif;line-height:1.5;color:#111;">
        <h2 style="margin:0 0 12px 0;">${senderName}</h2>
        <p style="margin:0 0 12px 0;">New SFMTA ticket for <strong>${plateLine}</strong>.</p>
        ${args.amount ? `<p style="margin:0 0 12px 0;">Amount $${args.amount}.</p>` : ``}
        ${args.dueLabel ? `<p style="margin:0 0 12px 0;">Due ${args.dueLabel}.</p>` : ``}
        <p style="margin:16px 0;">
          <a href="${shortUrl}" style="display:inline-block;background:#10b981;color:#fff;text-decoration:none;padding:10px 16px;border-radius:10px;">Pay at SFMTA</a>
        </p>
        <p style="margin:16px 0 0 0;font-size:12px;color:#555;">We never collect payments. You always pay at the official city portal.</p>
      </div>
    `;
    await sg.send({
      to: args.contact,
      from: { email: process.env.EMAIL_FROM as string, name: senderName },
      subject,
      html
    });
    return;
  }

  console.log('Email noop', { to: args.contact, plateLine, shortUrl });
}

export async function notifyOptIn(args: {
  channel: 'sms'|'email';
  contact: string;
  state: string;
  plate: string;
  subId?: string;
}) {
  const senderName = process.env.SENDER_NAME || 'TicketPay';
  const token = signMagic({ state: args.state, plate: args.plate, channel: args.channel, ts: Date.now(), subId: args.subId });
  const longUrl = `${appOrigin()}/m/${token}`;
  const { shortUrl } = await createShort(longUrl, 'optin');
  const plateLine = `${args.state.toUpperCase()} ${args.plate.toUpperCase()}`;

  if (args.channel === 'sms') {
    if (!hasTwilio()) { console.log('SMS optin noop', { to: args.contact, plateLine, shortUrl }); return; }
    const body = `${senderName}: Alerts ready for ${plateLine}. Manage: ${shortUrl} Reply STOP to opt out.`;
    await twilioClient().messages.create({ to: args.contact, from: process.env.TWILIO_FROM as string, body });
    return;
  }

  if (process.env.SENDGRID_API_KEY && process.env.EMAIL_FROM) {
    const subject = `${senderName} alerts ready for ${plateLine}`;
    const html = `
      <div style="font-family:Inter,system-ui,Arial,sans-serif;line-height:1.5;color:#111;">
        <h2 style="margin:0 0 12px 0;">${senderName}</h2>
        <p style="margin:0 0 12px 0;">Alerts are ready for <strong>${plateLine}</strong>.</p>
        <p style="margin:16px 0;">
          <a href="${shortUrl}" style="display:inline-block;background:#10b981;color:#fff;text-decoration:none;padding:10px 16px;border-radius:10px;">View confirmation</a>
        </p>
        <p style="margin:16px 0 0 0;font-size:12px;color:#555;">We never collect payments. You always pay at the official city portal.</p>
      </div>
    `;
    await sg.send({
      to: args.contact,
      from: { email: process.env.EMAIL_FROM as string, name: senderName },
      subject,
      html
    });
    return;
  }

  console.log('Email optin noop', { to: args.contact, plateLine, shortUrl });
}
