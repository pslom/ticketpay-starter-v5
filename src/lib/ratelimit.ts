import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

let client: Redis | null = null;
function getRedis() {
  if (client) return client;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  client = new Redis({ url, token });
  return client;
}

export async function limit(key: string, max: number, windowSeconds: number) {
  const redis = getRedis();
  if (!redis) return { ok: true, remaining: max, reset: Date.now() + windowSeconds * 1000, noop: true as const };
  const rl = new Ratelimit({ redis, limiter: Ratelimit.fixedWindow(max, `${windowSeconds} s`) });
  const res = await rl.limit(key);
  // Note: RatelimitResponse has { success, limit, remaining, reset, pending }; no `id`.
  return { ok: res.success, remaining: res.remaining, reset: Number(res.reset) };
}
