require('dotenv').config({ path: '.env.local' });
const sgMail = require('@sendgrid/mail');

const required = ['SENDGRID_API_KEY', 'MAIL_FROM_EMAIL', 'MAIL_FROM_NAME'];
const missing = required.filter((k) => !process.env[k]);
if (missing.length) {
  console.error('Missing required env vars in .env.local:', missing.join(', '));
  process.exit(1);
}

const to = process.argv[2];
if (!to) {
  console.error('Usage: node scripts/sendgrid-first.js you@example.com');
  process.exit(1);
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const msg = {
  to,
  from: { email: process.env.MAIL_FROM_EMAIL, name: process.env.MAIL_FROM_NAME },
  replyTo: process.env.MAIL_REPLY_TO || undefined,
  subject: 'TicketPay test email',
  text: 'Hello from TicketPay v5',
  html: '<strong>Hello from TicketPay v5</strong>',
  headers: process.env.NEXT_PUBLIC_BASE_URL
    ? { 'List-Unsubscribe': `<${process.env.NEXT_PUBLIC_BASE_URL}/unsubscribe>` }
    : undefined,
};

sgMail
  .send(msg)
  .then(() => { console.log('Email sent'); process.exit(0); })
  .catch((error) => { console.error(error.response?.body || error.message || error); process.exit(1); });
