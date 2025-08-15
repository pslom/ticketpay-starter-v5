export type LogMeta = Record<string, unknown> | undefined;

function safeStringify(obj: unknown) {
  try { return JSON.stringify(obj); } catch { return String(obj); }
}

export function log(level: 'info'|'warn'|'error'|'debug', message: string, meta?: LogMeta) {
  const payload = {
    ts: new Date().toISOString(),
    level,
    message,
    meta: meta || undefined
  };
  // Structured JSON to make logs easy to parse in Vercel/Upstash logs
  // Keep console methods mapped to appropriate stream
  if (level === 'error') console.error(safeStringify(payload));
  else if (level === 'warn') console.warn(safeStringify(payload));
  else console.log(safeStringify(payload));
}

export const info = (msg: string, meta?: LogMeta) => log('info', msg, meta);
export const warn = (msg: string, meta?: LogMeta) => log('warn', msg, meta);
export const error = (msg: string, meta?: LogMeta) => log('error', msg, meta);
export const debug = (msg: string, meta?: LogMeta) => {
  if (process.env.NODE_ENV !== 'production') log('debug', msg, meta);
};

export async function initSentry() {
  const dsn = process.env.SENTRY_DSN;
  if (!dsn) return;
  try {
    // dynamic import so missing @sentry/node is non-fatal
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Sentry = await import('@sentry/node');
    Sentry.init({ dsn, tracesSampleRate: 0.1 });
    info('sentry: initialized');
  } catch (e) {
    warn('sentry: failed to initialize (package missing or error)', { err: String((e as Error).message) });
  }
}
