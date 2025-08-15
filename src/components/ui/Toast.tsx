"use client";
import { useEffect, useState } from "react";
type Props = { message: string; kind?: "success" | "error"; onDone?: () => void; };
export default function Toast({ message, kind = "success", onDone }: Props) {
  const [open, setOpen] = useState(true);
  useEffect(() => { const t = setTimeout(() => { setOpen(false); onDone?.(); }, 2400); return () => clearTimeout(t); }, [onDone]);
  if (!open) return null;
  const base = "fixed inset-x-0 bottom-4 px-4";
  const box = `mx-auto max-w-md rounded-xl p-3 text-sm shadow ${kind==="success"?"bg-black text-white":"bg-red-600 text-white"}`;
  return <div className={base}><div className={box} role="status" aria-live="polite">{message}</div></div>;
}
