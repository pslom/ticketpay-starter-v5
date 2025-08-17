import React from "react";

export function LoadingButton({
  busy,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { busy?: boolean }) {
  return (
    <button
      {...props}
      disabled={busy || props.disabled}
      className={`h-12 rounded-xl bg-black text-white font-medium disabled:opacity-60 ${props.className || ""}`}
    >
      {busy ? "Processing…" : children}
    </button>
  );
}