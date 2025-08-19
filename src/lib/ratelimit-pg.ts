import type { PoolClient } from 'pg';

export async function limitPg(client: PoolClient, key: string, max: number, windowSeconds: number) {
  const sql = `
    WITH win AS (
      SELECT to_timestamp(floor(extract(epoch FROM now()) / $2) * $2) AS ws
    )
    INSERT INTO public.rate_limits (key, window_start, count)
    SELECT $1, ws, 1 FROM win
    ON CONFLICT (key, window_start) DO UPDATE
      SET count = public.rate_limits.count + 1
    RETURNING count,
      (extract(epoch FROM (window_start + ($2 * interval '1 second'))) * 1000)::bigint AS reset_ms
  `;
  const r = await client.query(sql, [key, windowSeconds]);
  const row = r.rows[0] || {};
  const count = Number(row.count || 0);
  const reset = Number(row.reset_ms || Date.now());
  const ok = count <= max; // allow up to max per window
  return { ok, remaining: Math.max(0, max - count), reset };
}
