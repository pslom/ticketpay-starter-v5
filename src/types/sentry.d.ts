declare module '@sentry/node' {
  export function init(...args: any[]): any;
  export function captureException(...args: any[]): any;
  export function captureMessage(...args: any[]): any;
  const Sentry: any;
  export default Sentry;
}
