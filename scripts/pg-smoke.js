require('dotenv').config({ path: '.env.local' });
const { Client } = require('pg');
(async () => {
  const c = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  try {
    await c.connect();
    console.log('PG connected');
    const r = await c.query('select now() as now');
    console.log('PG time', r.rows[0].now);
  } catch (e) {
    console.error('PG ERROR', e.message, e.code || '', e.detail || '');
  } finally { await c.end(); }
})();
