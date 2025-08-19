require('dotenv').config({ path: '.env.local' });
const twilio = require('twilio');
const sid = process.env.TWILIO_ACCOUNT_SID;
const token = process.env.TWILIO_AUTH_TOKEN;
const from = process.env.TWILIO_FROM;
const msid = process.env.TWILIO_MESSAGING_SID;
const to = process.argv[2];
if (!sid || !token || (!from && !msid)) { console.error('Missing TWILIO vars'); process.exit(1); }
if (!to) { console.error('Usage: node scripts/twilio-diagnose.js +1NUMBER'); process.exit(1); }
const client = twilio(sid, token);
(async () => {
  try {
    const params = msid ? { to, body: 'TicketPay test SMS', messagingServiceSid: msid } : { to, body: 'TicketPay test SMS', from };
    const msg = await client.messages.create(params);
    console.log('OK', { sid: msg.sid, status: msg.status });
  } catch (e) {
    const err = e || {};
    console.error('ERROR', {
      message: err.message,
      code: err.code,
      status: err.status,
      moreInfo: err.moreInfo,
      details: err.detail || err.response?.data || err,
    });
    process.exit(1);
  }
})();
