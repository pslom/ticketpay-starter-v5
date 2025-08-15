import { Pool, PoolClient } from 'pg';

let _pool: Pool | null = null;

export function getPool(): Pool {
  if (_pool) return _pool;

  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('env_missing_DATABASE_URL');

  // Prefer pinned CA if provided; allow self-signed only if explicitly enabled.
  const ca = process.env.SUPABASE_CA_PEM?.trim();
  const allowSelfSigned = process.env.ALLOW_SELF_SIGNED_TLS === '1';

  _pool = new Pool({
    connectionString: url,
    max: 3,
    ssl: ca
      ? { ca, rejectUnauthorized: true }
      : allowSelfSigned
      ? { rejectUnauthorized: false }
      : { rejectUnauthorized: true },
  });

  return _pool;
}

export async function withClient<T>(fn: (c: PoolClient) => Promise<T>): Promise<T> {
  const pool = getPool();
  const client = await pool.connect();
  try { return await fn(client); }
  finally { client.release(); }
}
