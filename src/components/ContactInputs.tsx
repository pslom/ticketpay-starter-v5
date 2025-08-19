"use client";
import { useState } from "react";
import { ResultsCopy } from "@/lib/copy";

export default function ContactInputs({
  mode,
  onSubmit,
}: {
  mode: "email" | "sms" | "both";
  onSubmit: (d: { email?: string; phone?: string }) => void;
}) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({
          email: mode !== "sms" ? email : undefined,
          phone: mode !== "email" ? phone : undefined,
        });
      }}
    >
  <h3 className="text-lg font-semibold">{ResultsCopy.subscribeLead}</h3>

    {(mode === "email" || mode === "both") && (
        <input
          type="email"
      placeholder={ResultsCopy.inputEmailPlaceholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2"
      required={mode === "email" || mode === "both"}
        />
      )}

    {(mode === "sms" || mode === "both") && (
        <input
          type="tel"
      placeholder={ResultsCopy.inputPhonePlaceholder}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2"
      required={mode === "sms" || mode === "both"}
        />
      )}

  <button className="inline-flex items-center px-4 py-2 rounded-lg bg-emerald-600 text-white">
    {ResultsCopy.subscribeCta}
      </button>
    </form>
  );
}
