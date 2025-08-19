"use client";
import React, { Suspense } from "react";
import TogglePills from "@/components/TogglePills";
import StepJourney from "@/components/StepJourney";
import { ResultsCopy } from "@/lib/copy";
import { useSearchParams } from "next/navigation";

function ResultsInner() {
  const params = useSearchParams();
  const plate = (params.get("plate") || "ABC123").toUpperCase();
  const state = params.get("state") || "CA";

  const [channel, setChannel] = React.useState<"email"|"sms">("email");
  const [value, setValue] = React.useState("");

  async function subscribe() {
    // keep your real subscribe action here
  }

  return (
    <main className="bg-white">
      <section className="mx-auto max-w-2xl px-4 py-8">
        <div className="tp-fade">
          <h1 className="text-3xl font-bold text-neutral-900">{ResultsCopy.title}</h1>
          <p className="mt-2 text-neutral-700">{ResultsCopy.lead(plate, state)}</p>
        </div>

        {/* Polished subscribe card with depth */}
        <div className="mt-6 tp-surface p-5 tp-fade" style={{animationDelay:"60ms"}}>
          <p className="text-sm text-neutral-800 mb-3">{ResultsCopy.subscribeLead}</p>

          <TogglePills
            value={channel}
            onChange={(v)=>setChannel(v as any)}
            options={[{label: ResultsCopy.channelEmail, value:"email"},{label: ResultsCopy.channelSms, value:"sms"}]}
          />

          <div className="mt-3">
            <input
              className="tp-input"
              placeholder={channel === "email" ? ResultsCopy.inputEmailPlaceholder : ResultsCopy.inputPhonePlaceholder}
              inputMode={channel === "email" ? "email" : "tel"}
              aria-label={channel === "email" ? "Email address" : "Mobile number"}
              value={value}
              onChange={e=>setValue(e.target.value)}
              required
            />
          </div>

          <button className="tp-btn mt-4" onClick={subscribe}>{ResultsCopy.ctaSubscribe}</button>

          {/* Twilio-compliant disclosure under CTA */}
          <p className="tp-micro mt-3">
            By subscribing, you agree to receive alerts for this plate. Message &amp; data rates may apply. Reply STOP to cancel, HELP for help. See our {""}
            <a href="/consent" className="underline">{ResultsCopy.trustConsentLinkLabel}</a>.
          </p>
        </div>

        {/* Compact benefits row */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="tp-surface p-4">
            <h3 className="font-medium">Instant alerts</h3>
            <p className="tp-micro mt-1">Email or SMS the moment a ticket posts.</p>
          </div>
          <div className="tp-surface p-4">
            <h3 className="font-medium">Clear status</h3>
            <p className="tp-micro mt-1">Know what’s open so you can act early.</p>
          </div>
          <div className="tp-surface p-4">
            <h3 className="font-medium">Easy opt-out</h3>
            <p className="tp-micro mt-1">Every alert includes a direct unsubscribe link.</p>
          </div>
        </div>

        {/* Guided steps (ties to activation KPI) */}
        <StepJourney active={2}/>
      </section>
    </main>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <main className="mx-auto max-w-2xl px-4 py-8 space-y-3">
        <div className="h-20 rounded-2xl bg-neutral-200 animate-pulse" />
        <div className="h-20 rounded-2xl bg-neutral-200 animate-pulse" />
      </main>
    }>
      <ResultsInner />
    </Suspense>
  );
}
