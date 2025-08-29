'use client';
import { useState } from 'react';

function formatUS(digits: string) {
  const d = digits.replace(/\D/g,'').slice(0,10);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `(${d.slice(0,3)}) ${d.slice(3)}`;
  return `(${d.slice(0,3)}) ${d.slice(3,6)}-${d.slice(6)}`;
}
function cleanKeepPlus(raw: string) {
  if (!raw) return '';
  return raw.startsWith('+')
    ? ('+' + raw.slice(1).replace(/\D/g,''))
    : raw.replace(/\D/g,'');
}
function isE164(s: string) {
  return /^\+[1-9]\d{7,14}$/.test(s);
}

export default function PhoneField(props: { value: string; onChange: (v:string)=>void; placeholder?: string }) {
  const [val, setVal] = useState(props.value);

  const cleaned = cleanKeepPlus(val);
  const valid = isE164(cleaned);

  return (
    <div className="space-y-1">
      <input
        className="input"
        inputMode="tel"
        placeholder={props.placeholder || '(415) 555-0123'}
        value={val}
        aria-describedby={valid ? 'phone-valid-hint' : undefined}
        onChange={(e)=>{
          const next = e.target.value;
          setVal(next);
          props.onChange(cleanKeepPlus(next));
        }}
        onBlur={()=>{
          const c = cleanKeepPlus(val);
          setVal(isE164(c) ? c : formatUS(c));
        }}
        onFocus={()=>{
          setVal(cleanKeepPlus(val));
        }}
      />
      <p
        id="phone-valid-hint"
        role="status"
        aria-live="polite"
        className={`text-sm ${valid ? 'text-emerald-700' : 'sr-only'}`}
      >
        ✓ Looks valid
      </p>
    </div>
  );
}
