type EventName =
  | 'home_step1_valid_plate'
  | 'home_step2_view'
  | 'subscribe_submit'
  | 'subscribe_success'
  | 'manage_pause'
  | 'manage_delete'
  | 'manage_add_plate';

function maskContact(contact: string) {
  if (!contact) return '';
  if (contact.includes('@')) {
    const [n, d] = contact.split('@');
    return `${n?.slice(0,2)}***@${d}`;
  }
  // phone
  const digits = contact.replace(/\D/g, '');
  return digits.length >= 4 ? `***${digits.slice(-4)}` : '***';
}

export function track(name: EventName, payload: Record<string, unknown> = {}) {
  try {
    const body = { name, ts: Date.now(), ...payload };
    // swap this for your analytics SDK later:
    if (process.env.NODE_ENV !== 'production') console.log('track', body);
    // TODO: send to /api/track if needed
  } catch (_) {}
}

export { maskContact };
