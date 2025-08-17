import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";
import Link from "next/link";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: { default: "TicketPay", template: "%s • TicketPay" },
  description: "Real-time parking ticket alerts for San Francisco.",
  icons: {
    icon: "/icon.svg",
    other: [{ rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#111827" }],
  },
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased text-[16px] text-black">
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-black/5">
          <div className="mx-auto max-w-2xl px-4 h-14 flex items-center justify-between">
            <Link href="/" className="text-base font-semibold tracking-tight hover:text-brand transition-colors">
              TicketPay
            </Link>
            <Link
              href="/manage"
              className="rounded-full border border-black/10 px-3 py-1.5 text-sm hover:bg-black/5 transition"
            >
              Manage alerts
            </Link>
          </div>
        </header>
        <main id="main">{children}</main>
      </body>
    </html>
  );
}
