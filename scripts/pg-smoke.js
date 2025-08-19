require('dotenv').config({ path: '.env.local' });
const fs = require('node:fs');
const path = require('node:path');
const { Client } = require('pg');

(async () => {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error('PG ERROR env_missing_DATABASE_URL');
    process.exit(1);
  }
  // Build SSL similar to src/lib/pg.ts
  const envAllow = process.env.ALLOW_SELF_SIGNED_TLS;
  const allowSelfSigned = envAllow === '1' || (envAllow == null && process.env.NODE_ENV !== 'production');
  // If explicitly allowing self-signed, force global bypass to handle deep proxy chains
  if (envAllow === '1' && process.env.NODE_ENV !== 'production') {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  }
  let ssl;
  if (allowSelfSigned && process.env.NODE_ENV !== 'production') {
    ssl = { rejectUnauthorized: false };
  } else {
    let ca = process.env.SUPABASE_CA_PEM && process.env.SUPABASE_CA_PEM.trim();
    if (!ca && process.env.SUPABASE_CA_PEM_FILE) {
      try {
        const resolved = path.isAbsolute(process.env.SUPABASE_CA_PEM_FILE)
          ? process.env.SUPABASE_CA_PEM_FILE
          : path.resolve(process.cwd(), process.env.SUPABASE_CA_PEM_FILE);
        ca = fs.readFileSync(resolved, 'utf8');
      } catch {}
    }
    ssl = ca ? { ca, rejectUnauthorized: true } : { rejectUnauthorized: true };
  }

  const host = (() => { try { return new URL(url).host; } catch { return undefined; } })();
  const mode = (ssl && ssl.rejectUnauthorized === false) ? 'DEV_SELF_SIGNED' : (ssl && ssl.ca ? 'PINNED_CA' : 'STRICT_VERIFY');
  console.log('[pg-smoke] connecting', { host, mode });

  const c = new Client({ connectionString: url, ssl });
  try {
    await c.connect();
    console.log('PG connected');
    const r = await c.query('select now() as now');
    console.log('PG time', r.rows[0].now);
  } catch (e) {
    console.error('PG ERROR', e.message, e.code || '', e.detail || '');
  } finally { await c.end(); }
})();
