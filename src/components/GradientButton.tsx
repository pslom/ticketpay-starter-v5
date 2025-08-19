import React from "react";

export default function GradientButton({
  busy,
  success,
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { busy?: boolean; success?: boolean }) {
  return (
    <button
      {...props}
      disabled={busy || props.disabled}
      className={`btn-brand h-12 w-full rounded-xl font-medium shadow-sm disabled:opacity-60 ${className || ""}`}
    >
      {success ? (
        <span className="inline-flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Success
        </span>
      ) : busy ? "Processing…" : children}
    </button>
  );
}