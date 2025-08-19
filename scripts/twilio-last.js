require('dotenv').config({ path: '.env.local' });
const twilio = require('twilio');
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
(async () => {
  try {
    const msgs = await client.messages.list({ limit: 10 });
    for (const m of msgs) {
      console.log({ sid: m.sid, to: m.to, from: m.from, status: m.status, error_code: m.errorCode, error_message: m.errorMessage });
    }
  } catch (e) { console.error(e.message || e); process.exit(1); }
})();
