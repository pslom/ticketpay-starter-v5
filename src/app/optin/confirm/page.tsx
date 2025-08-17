'use client';

import React from "react";

export default function ConfirmPage() {
  const [state, setState] = React.useState<"pending"|"ok"|"error">("pending");
  const [msg, setMsg] = React.useState("Confirming…");

  React.useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const token = p.get("token");
    if (!token) { setState("error"); setMsg("Missing token."); return; }
    fetch(`/api/optin/confirm?token=${encodeURIComponent(token)}`, { cache: "no-store" })
      .then(r => r.json())
      .then(j => {
        if (j?.ok) { setState("ok"); setMsg(`You're set. We’ll alert you instantly in San Francisco.`); }
        else { setState("error"); setMsg("Link is invalid or expired."); }
      })
      .catch(() => { setState("error"); setMsg("Link is invalid or expired."); });
  }, []);

  return (
    <main className="mx-auto max-w-md px-4 py-12">
      {state === "pending" && <p className="text-sm text-gray-700">{msg}</p>}
      {state === "ok" && (
        <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
          <h1 className="text-xl font-semibold text-green-900">Alerts confirmed</h1>
          <p className="mt-1 text-sm text-green-900/80">{msg}</p>
          <div className="mt-4 flex gap-3">
            <a href="/manage" className="rounded-xl border border-green-300 bg-white px-3 py-2 text-sm">Manage alerts</a>
            <a href="/" className="rounded-xl border border-green-300 bg-white px-3 py-2 text-sm">Search another plate</a>
          </div>
        </div>
      )}
      {state === "error" && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
          <h1 className="text-xl font-semibold text-red-900">We couldn’t confirm</h1>
          <p className="mt-1 text-sm text-red-900/80">{msg}</p>
          <div className="mt-4">
            <a href="/" className="rounded-xl border border-red-300 bg-white px-3 py-2 text-sm">Back to home</a>
          </div>
        </div>
      )}
    </main>
  );
}
