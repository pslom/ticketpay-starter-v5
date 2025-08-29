'use client';

export default function PhonePreview() {
  return (
    <div className="phone-frame">
      <div className="phone-notch" />
      <div className="phone-screen">
        {/* Status row */}
        <div className="text-[10px] text-neutral-400 text-center mt-3">Today 9:41 AM</div>

        {/* Header */}
        <div className="font-semibold text-center text-sm text-neutral-800 mt-1">TicketPay</div>

        {/* Message bubbles */}
        <div className="mt-3 flex flex-col gap-2 px-4">
          <div className="bubble">
            <div className="font-semibold">New ticket for CA 7ABC123</div>
            <div className="text-[12px] text-neutral-600 mt-1">
              $73 · Expired meter · Mission &amp; 3rd
            </div>
            <div className="text-[11px] text-neutral-400 mt-1">
              Posted 12m ago · Due in 21 days
            </div>
          </div>

          <div className="bubble">
            <div className="text-[13px] text-neutral-700">
              Pay safely at the official portal:
            </div>
            <button className="inline-flex items-center justify-center px-3 py-1.5 rounded-full bg-emerald-600 text-white text-[12px] mt-2 shadow-sm">
              Pay at SFMTA
            </button>
          </div>

          <div className="text-[11px] text-neutral-400 px-4 mt-1">SMS · (415) 555-0123</div>
        </div>

        {/* Home indicator pad */}
        <div className="mt-auto h-10 flex items-center justify-center">
          <div className="w-28 h-[5px] rounded-full bg-neutral-200" />
        </div>
      </div>
    </div>
  );
}
