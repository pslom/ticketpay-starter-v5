require('dotenv').config({ path: '.env.local' });
const { Client } = require('pg');
const fs = require('fs');
(async () => {
const sql = fs.readFileSync('scripts/schema.sql', 'utf8');
const client = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
try { await client.connect(); await client.query(sql); console.log('DB schema applied'); }
catch (e) { console.error('DB INIT ERROR', e.message); process.exit(1); }
finally { await client.end(); }
})();
