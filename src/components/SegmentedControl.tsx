'use client'
export default function SegmentedControl({
  value, onChange, options,
}: { value: string; onChange: (v: string)=>void; options: {value:string;label:string}[] }) {
  return (
    <div role="tablist" aria-label="Choose alert channel" className="inline-flex rounded-full bg-gray-100 p-1">
      {options.map((o) => {
        const active = value === o.value
        return (
          <button
            key={o.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o.value)}
            className={`px-3 py-1.5 text-sm rounded-full border transition
              ${active ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50'}`}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
