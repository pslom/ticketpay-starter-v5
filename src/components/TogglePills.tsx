type Opt = { label: string; value: string };

export default function TogglePills({
  value,
  onChange,
  options,
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  options: Opt[];
  className?: string;
}) {
  return (
    <div className={["inline-flex rounded-full bg-neutral-100 p-1", className].join(" ")}>
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={[
              "px-3 py-1.5 rounded-full text-sm transition-colors",
              active ? "bg-white shadow text-neutral-900" : "text-neutral-600 hover:text-neutral-800",
            ].join(" ")}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
