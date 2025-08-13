require('dotenv').config({ path: '.env.local' });
const sgMail = require('@sendgrid/mail');

if (!process.env.SENDGRID_API_KEY || !process.env.SENDGRID_FROM) {
  console.error('Missing SENDGRID_API_KEY or SENDGRID_FROM in .env.local');
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
  from: process.env.SENDGRID_FROM,
  subject: 'TicketPay test email',
  text: 'Hello from TicketPay v5',
  html: '<strong>Hello from TicketPay v5</strong>',
};

sgMail
  .send(msg)
  .then(() => { console.log('Email sent'); process.exit(0); })
  .catch((error) => { console.error(error.response?.body || error.message || error); process.exit(1); });
