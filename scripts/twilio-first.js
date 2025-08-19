require('dotenv').config({ path: '.env.local' });
const twilio = require('twilio');

const sid = process.env.TWILIO_ACCOUNT_SID;
const token = process.env.TWILIO_AUTH_TOKEN;
const from = process.env.TWILIO_FROM;
const to = process.argv[2];

if (!sid || !token || !from) {
  console.error('Missing TWILIO_* envs in .env.local');
  process.exit(1);
}
if (!to) {
  console.error('Usage: node scripts/twilio-first.js +14155551234');
  process.exit(1);
}

const client = twilio(sid, token);
client.messages.create({ from, to, body: 'TicketPay test SMS' })
  .then(() => { console.log('SMS sent'); process.exit(0); })
  .catch((e) => { console.error(e?.message || e); process.exit(1); });
