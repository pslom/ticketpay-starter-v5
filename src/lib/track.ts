export const EVENTS = {
  VIEW_LANDING: 'view_landing',
  SUBMIT_PLATE: 'submit_plate',
  VIEW_RESULTS: 'view_results',
  SELECT_CHANNEL: 'select_channel',
  SUBSCRIBE_ATTEMPT: 'subscribe_attempt',
  SUBSCRIBE_SUCCESS: 'subscribe_success',
  SUBSCRIBE_ERROR: 'subscribe_error',
  MANAGE_VIEW: 'manage_view',
  UNSUBSCRIBE_CLICK: 'unsubscribe_click',
} as const;

type E = typeof EVENTS[keyof typeof EVENTS];

export function track(ev: E, data?: Record<string, unknown>) {
  try {
    if (typeof window === 'undefined') return;
    // swap this console with your real analytics (PostHog, Segment, etc.)
    console.debug('[track]', ev, data || {});
  } catch {}
}
