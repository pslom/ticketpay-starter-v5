'use client';
import Link from 'next/link';

export function ExampleTiles() {
  return (
    <div className="card p-6 md:p-8">
      <p className="meta mb-4">What it looks like</p>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-emerald-200/60 bg-emerald-50 p-4">
          <div className="flex items-start gap-3">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-emerald-600 text-white">✓</div>
            <div className="flex-1">
              <p className="font-semibold text-neutral-900">Alerts active for <span className="text-emerald-700">CA 7ABC123.</span></p>
              <Link href="/l/pay" className="btn-primary mt-3 inline-flex h-10 rounded-lg px-4 text-sm">Pay at SFMTA</Link>
              <p className="meta mt-2">Official city payment portal</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="pill bg-neutral-100 text-neutral-700">CA</span>
              <span className="font-semibold tracking-wide">7ABC123</span>
              <span className="chip">Active</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="btn-secondary h-10 px-4">Pause</button>
              <button className="btn-secondary h-10 px-4">Delete</button>
            </div>
          </div>
          <p className="meta mt-2">SMS · (415) 555-0123</p>
        </div>
      </div>
    </div>
  );
}
