export function Helper({ id, tone, children }:{ id:string; tone?:'error'|'muted'; children:React.ReactNode }) {
  return (
    <p id={id} aria-live="polite" className={`mt-1 text-xs ${tone==='error' ? 'text-rose-600' : 'text-gray-500'}`}>
      {children}
    </p>
  )
}
