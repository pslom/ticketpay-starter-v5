// src/components/PreviewBlock.tsx
"use client";

import { useState } from "react";
import { ConfirmCopy } from "@/lib/copy";

export default function PreviewBlock({
  email,
  phone,
  visible = false,
}: {
  email?: string;
  phone?: string;
  visible?: boolean;
}) {
  const [msg, setMsg] = useState<string>("");

  if (!visible) return null;

  async function send() {
    setMsg("Sending…");
    const res = await fetch("/api/send-test", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, phone }),
    });
    const j = await res.json();
    setMsg(j.ok ? ConfirmCopy.testSent : "Could not send test right now.");
  }

  return (
    <div className="rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">{ConfirmCopy.previewTitle}</p>
          <p className="text-sm text-gray-500">{ConfirmCopy.previewHelp}</p>
        </div>
        <button onClick={send} className="px-3 py-2 rounded-lg bg-black text-white">
          {ConfirmCopy.sendTest}
        </button>
      </div>
      {msg && <p className="mt-2 text-sm">{msg}</p>}
    </div>
  );
}
