"use client";
import { useState } from "react";
import { COPY } from "@/lib/copy";

export default function PreviewBlock({ email, phone }: { email?: string; phone?: string }) {
  const [msg, setMsg] = useState<string>("");

  async function send() {
    setMsg("Sending…");
    const r = await fetch("/api/send-test", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, phone }),
    });
    const j = await r.json();
    setMsg(j.ok ? COPY.testSent : "Could not send test right now.");
  }

  return (
    <div className="rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">{COPY.previewTitle}</p>
          <p className="text-sm text-gray-500">{COPY.previewHelp}</p>
        </div>
        <button onClick={send} className="px-3 py-2 rounded-lg bg-black text-white">
          {COPY.sendTest}
        </button>
      </div>
      {msg && <p className="mt-2 text-sm">{msg}</p>}
    </div>
  );
}
