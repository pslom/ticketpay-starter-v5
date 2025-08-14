import { Pool } from 'pg';

let _pool: Pool | undefined;

export function getPool(): Pool {
  if (_pool) return _pool;
  const cs = process.env.DATABASE_URL;
  if (!cs) {
    throw new Error('DATABASE_URL missing');
  }
  let u: URL;
  try { u = new URL(cs); } catch (e) {
    console.error('DB_URL_PARSE_ERROR', String(cs));
    throw e;
  }
  const sslMode = (u.searchParams.get('sslmode') || '').toLowerCase();
  const ssl = sslMode === 'require' ? { rejectUnauthorized: false } : undefined;

  _pool = new Pool({
    host: u.hostname,
    port: Number(u.port || 5432),
    user: decodeURIComponent(u.username),
    password: decodeURIComponent(u.password),
    database: u.pathname.replace(/^\//, ''),
    ssl,
    max: process.env.NODE_ENV === 'production' ? 3 : 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });
  return _pool;
}
