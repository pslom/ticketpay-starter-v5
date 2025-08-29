"use client";
import { useEffect, useRef } from "react";

export default function ConfettiOnce() {
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    import("canvas-confetti").then((m) => {
      const c = m.default;
      c({ particleCount: 120, spread: 70, origin: { y: 0.7 } });
      setTimeout(() => c({ particleCount: 100, spread: 90, scalar: 0.8, origin: { y: 0.6 } }), 300);
    });
  }, []);
  return null;
}
