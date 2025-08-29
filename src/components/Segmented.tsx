'use client'
import { Dispatch, SetStateAction } from 'react'
export default function Segmented({value,setValue,options}:{value:string,setValue:Dispatch<SetStateAction<string>>,options:{label:string,value:string}[]}) {
  return (
    <div role="tablist" aria-label="Channel" className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-1">
      {options.map(o=>{
        const active=o.value===value
        return (
          <button key={o.value} role="tab" aria-selected={active} onClick={()=>setValue(o.value)}
            className={`px-4 py-2 rounded-xl transition ${active?'bg-emerald-600 text-white':'text-slate-700 hover:bg-white'}`}>
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
