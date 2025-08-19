import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import sgMail from '@sendgrid/mail';

// Load .env and .env.local (Next.js uses .env.local in dev)
dotenv.config();
const envLocalPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath, override: true });
}

let key = process.env.SENDGRID_API_KEY || '';
key = key.trim().replace(/^['"]|['"]$/g, ''); // strip surrounding quotes if pasted
const to = process.argv[2] || process.env.TEST_EMAIL || 'you@example.com';
const from = process.env.MAIL_FROM_EMAIL || 'info@ticketpay.us.com';
const fromName = process.env.MAIL_FROM_NAME || 'TicketPay';
const replyTo = process.env.MAIL_REPLY_TO || from;

if (!key) {
  console.error("SENDGRID_API_KEY missing");
  process.exit(1);
}
sgMail.setApiKey(key);

try {
  const [resp] = await sgMail.send({
    to,
    from: { email: from, name: fromName },
    replyTo,
    subject: 'TicketPay test — SendGrid OK',
    text: 'Hello from TicketPay via SendGrid.',
    html: '<strong>Hello from TicketPay via SendGrid.</strong>',
  });
  console.log('Sent:', resp.statusCode);
} catch (err) {
  const body = err?.response?.body;
  if (body) console.error('SendGrid error body:', body);
  console.error('SendGrid error:', err.message || err);
  process.exit(1);
}