require('dotenv').config({ path: '.env.local' });
const { Client } = require('pg');

(async () => {
  const client = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  try {
    await client.connect();
    const plate = process.env.TEST_PLATE || '7ABC123';
    const state = process.env.TEST_STATE || 'CA';
    const channel = process.env.TEST_CHANNEL || 'email';
    const email = process.env.TEST_EMAIL;
    const phone = process.env.TEST_PHONE;

    const sub = await client.query(
      `insert into public.subscriptions (plate, plate_normalized, state, channel, value, city)
       values ($1,$2,$3,$4,$5,$6)
       on conflict (plate_normalized, state, channel, value, city) do update set plate=excluded.plate
       returning id`,
      [plate, plate.replace(/[^A-Z0-9]/g, '').toUpperCase(), state.toUpperCase(), channel, channel==='email'?email:phone, process.env.CITY_DEFAULT || 'SF']
    );
    const id = sub.rows[0]?.id;
    if (!id) throw new Error('failed to upsert subscription');

    const payload = { plate, state, email, phone, method: channel };
    const r = await client.query(
      `insert into public.subscription_alerts (subscription_id, alert_type, scheduled_at, channel, payload)
       values ($1,$2,now() + interval '1 minute',$3,$4::jsonb) returning id`,
      [id, 'posted', channel, JSON.stringify(payload)]
    );
    console.log('Enqueued test alert id:', r.rows[0]?.id, 'for subscription', id);
  } catch (e) {
    console.error('ENQUEUE TEST ERROR', e.message);
    process.exit(1);
  } finally {
    await client.end();
  }
})();
