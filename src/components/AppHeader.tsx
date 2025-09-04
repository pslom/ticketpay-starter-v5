// src/components/AppHeader.tsx
'use client';

export default function AppHeader() {
  return (
    <header className="w-full bg-white border-b border-slate-200">
      <div className="mx-auto max-w-4xl px-4 h-14 flex items-center justify-between">
        <div className="text-lg font-semibold">
          <span className="text-slate-900">Ticket</span>
          <span className="text-indigo-600">Pay</span>
        </div>
        <nav className="flex items-center gap-4 text-sm">
          <a href="/security" className="text-slate-600 hover:text-slate-900">Security</a>
          <a href="/status" className="text-slate-600 hover:text-slate-900">Status</a>
          <a href="/support" className="text-slate-600 hover:text-slate-900">Support</a>
        </nav>
      </div>
    </header>
  );
}
