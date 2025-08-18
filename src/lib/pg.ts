import { Pool, PoolClient } from 'pg';
import fs from 'node:fs';
import path from 'node:path';

let _pool: Pool | null = null;

export function getPool(): Pool {
  if (_pool) return _pool;

  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('env_missing_DATABASE_URL');

  // Prefer pinned CA if provided; allow self-signed in dev by default (unless explicitly disabled).
  let ca = process.env.SUPABASE_CA_PEM?.trim();
  // Also support providing a file path via SUPABASE_CA_PEM_FILE.
  if (!ca) {
    const caFile = process.env.SUPABASE_CA_PEM_FILE?.trim();
    if (caFile) {
      try {
        const resolved = path.isAbsolute(caFile) ? caFile : path.resolve(process.cwd(), caFile);
        ca = fs.readFileSync(resolved, 'utf8');
      } catch {
        // ignore file read errors; we'll fall back to ALLOW_SELF_SIGNED_TLS or default verify
      }
    }
  }
  const envAllow = process.env.ALLOW_SELF_SIGNED_TLS;
  const allowSelfSigned = envAllow === '1' || (envAllow == null && process.env.NODE_ENV !== 'production');
  if (allowSelfSigned && process.env.NODE_ENV !== 'production') {
    // Global dev safeguard: ensure Node TLS doesn’t block self-signed chains
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  }

  _pool = new Pool({
    connectionString: url,
    max: 3,
    ssl: allowSelfSigned
      ? { rejectUnauthorized: false }
      : ca
      ? { ca, rejectUnauthorized: true }
      : { rejectUnauthorized: true },
  });

  if (process.env.NODE_ENV !== 'production') {
    const mode = allowSelfSigned ? (envAllow === '1' ? 'ALLOW_SELF_SIGNED' : 'DEV_DEFAULT_SELF_SIGNED') : (ca ? 'PINNED_CA' : 'STRICT_VERIFY');
    console.log('[pg] pool created', { tls: mode });
  }

  return _pool;
}

export async function withClient<T>(fn: (c: PoolClient) => Promise<T>): Promise<T> {
  const pool = getPool();
  const client = await pool.connect();
  try { return await fn(client); }
  finally { client.release(); }
}
