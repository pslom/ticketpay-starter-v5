import { Pool, PoolClient } from 'pg';
import fs from 'node:fs';
import path from 'node:path';

// If prod has ALLOW_SELF_SIGNED_TLS=1, set the global override ASAP.
// Doing this at module load ensures any downstream TLS calls honor it.
(() => {
  const envAllow = (process.env.ALLOW_SELF_SIGNED_TLS || '').trim();
  if (envAllow === '1') {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  }
})();

let _pool: Pool | null = null;

export function getPool(): Pool {
  if (_pool) return _pool;

  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('env_missing_DATABASE_URL');

  // Try inline CA first, fallback to file path
  let ca: string | undefined;
  const inline = (process.env.SUPABASE_CA_PEM || '').trim();
  if (inline) {
    ca = inline;
  } else {
    const caFile = (process.env.SUPABASE_CA_PEM_FILE || '').trim();
    if (caFile) {
      try {
        const resolved = path.isAbsolute(caFile) ? caFile : path.resolve(process.cwd(), caFile);
        ca = fs.readFileSync(resolved, 'utf8');
      } catch {
        // ignore; we'll fall back below
      }
    }
  }

  const envAllow = (process.env.ALLOW_SELF_SIGNED_TLS || '').trim();
  const allowSelfSigned = envAllow === '1';

  // Build ssl config for node-postgres
  const sslConfig =
    allowSelfSigned
      ? { rejectUnauthorized: false }
      : ca
      ? { ca, rejectUnauthorized: true }
      : { rejectUnauthorized: true };

  _pool = new Pool({
    connectionString: url,
    max: 3,
    ssl: sslConfig as any,
  });

  if (process.env.NODE_ENV !== 'production') {
    const mode = allowSelfSigned ? 'ALLOW_SELF_SIGNED' : (ca ? 'PINNED_CA' : 'STRICT_VERIFY');
    console.log('[pg] pool created', { tls: mode });
  }

  return _pool;
}

export async function withClient<T>(fn: (c: PoolClient) => Promise<T>): Promise<T> {
  const pool = getPool();
  const client = await pool.connect();
  try {
    return await fn(client);
  } finally {
    client.release();
  }
}

