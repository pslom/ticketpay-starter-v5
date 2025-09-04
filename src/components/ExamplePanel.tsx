'use client';

import Link from 'next/link';

const PAY_AT_SFMTA_URL =
  'https://wmq.etimspayments.com/pbw/include/sanfrancisco/input.jsp';
'use client';
export default function ExamplePanel(){
  return (
    <aside className="card p-4 md:p-6">
      <p className="text-sm font-medium text-emerald-900/80 mb-3">What you’ll get</p>

      {/* Example A: Pay at SFMTA (success state) */}
      <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 mb-4">
        <div className="flex items-start gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-emerald-500 text-white font-bold">✓</div>
          <div className="flex-1">
            <p className="text-neutral-900">
              Alerts active for <span className="font-semibold">CA 7ABC123</span>.
            </p>
            <div className="mt-3 flex items-center gap-3">
              <a
                href="https://wmq.etimspayments.com/pbw/include/sanfrancisco/input.jsp"
                className="btn-primary"
                target="_blank" rel="noreferrer"
              >
                Pay at SFMTA
              </a>
              <span className="text-xs text-neutral-600">Official city payment portal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Example B: Manage row */}
      <div className="rounded-xl border border-neutral-200 bg-white p-4">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 px-3 py-2">
            <span className="text-xs font-semibold text-neutral-700">CA</span>
            <span className="font-semibold tracking-wide">7ABC123</span>
            <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">Active</span>
          </div>
          <div className="text-sm text-neutral-600 flex-1 truncate">SMS · (415) 555-0123</div>
          <button className="btn-secondary">Pause</button>
          <button className="inline-flex h-10 items-center justify-center rounded-lg bg-red-50 px-3 text-red-700 font-semibold">Delete</button>
        </div>
      </div>
    </aside>
  );
}

        {/* Manage list row */}
        <div className="md:col-span-2 rounded-2xl border border-black/10 bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-[15px] font-semibold text-neutral-900">
                <span className="badge-pill">CA</span>
                <span>7ABC123</span>
                <span className="rounded-full bg-emerald-50 px-2 py-[2px] text-xs font-medium text-emerald-700">
                  Active
                </span>
              </div>
              <p className="mt-1 truncate text-sm text-neutral-700">SMS · (415) 555-0123</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm hover:bg-neutral-50">
                Pause
              </button>
              <button className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 hover:bg-red-100">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Check() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M20 6L9 17l-5-5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Clock() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
