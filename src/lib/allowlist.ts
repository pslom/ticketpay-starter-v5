const ALLOWED = [
  /^https?:\/\/(?:www\.)?wmq\.etimspayments\.com\//i,
  /^https?:\/\/(?:www\.)?sfmta\.com\//i,
  /^https?:\/\/data\.sfgov\.org\//i
];

export function ensureAllowed(url: string) {
  return ALLOWED.some(rx => rx.test(url));
}
