import React from "react";

export default function BrandButton({
  busy,
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { busy?: boolean }) {
  return (
    <button
      {...props}
      disabled={busy || props.disabled}
      className={`h-12 w-full rounded-xl bg-black text-white font-medium transition
                  hover:translate-y-[-1px] active:translate-y-[0] disabled:opacity-60 ${className || ""}`}
    >
      {busy ? "Processing…" : children}
    </button>
  );
}