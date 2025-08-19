"use client";
import { useState } from "react";
import { ResultsCopy } from "@/lib/copy";

type Mode = "email" | "sms" | "both";

export default function ChannelSelect({ onNext }: { onNext: (m: Mode) => void }) {
  const [value, setValue] = useState<Mode>("email");

  return (
    <div className="space-y-4">
  <h3 className="text-lg font-semibold">{ResultsCopy.subscribeLead}</h3>
      <div className="flex gap-3">
        {(["email", "sms", "both"] as Mode[]).map((opt) => (
          <button
            key={opt}
            onClick={() => setValue(opt)}
            className={`px-3 py-2 rounded-lg border ${value === opt ? "border-black" : "border-gray-300"}`}
            aria-pressed={value === opt}
          >
            {opt.toUpperCase()}
          </button>
        ))}
      </div>
      <button
        onClick={() => onNext(value)}
        className="mt-2 inline-flex items-center px-4 py-2 rounded-lg bg-black text-white"
      >
        Continue
      </button>
    </div>
  );
}
