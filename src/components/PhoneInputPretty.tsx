'use client'
import { useState, useEffect } from 'react';

function formatUS(v: string) {
  const d = v.replace(/\D/g, '').slice(0, 11); // allow leading 1
  const core = d.startsWith('1') ? d.slice(1) : d;
  const p1 = core.slice(0,3), p2 = core.slice(3,6), p3 = core.slice(6,10);
  if (!p1) return '';
  if (!p2) return `(${p1}`;
  if (!p3) return `(${p1}) ${p2}`;
  return `(${p1}) ${p2}-${p3}`;
}
function toE164(v: string) {
  const d = v.replace(/\D/g, '');
  const core = d.startsWith('1') ? d : `1${d}`;
  return `+${core}`;
}

export default function PhoneInputPretty({
  value, onChange, id, placeholder="(415) 555-0123"
}:{ value:string; onChange:(e164:string)=>void; id?:string; placeholder?:string }) {
  const [local, setLocal] = useState(formatUS(value));
  useEffect(()=>{ setLocal(formatUS(value)); }, [value]);
  return (
    <input
      id={id}
      className="input px-3 flex-1 max-w-sm"
      inputMode="tel"
      autoComplete="tel"
      placeholder={placeholder}
      value={local}
      onChange={(e)=>{
        const pretty = formatUS(e.target.value);
        setLocal(pretty);
        onChange(toE164(pretty));
      }}
    />
  );
}
