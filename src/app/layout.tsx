import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata = {
  title: "TicketPay",
  description: "Real-time ticket alerts in San Francisco, CA.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {/* Skip link for accessibility */}
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-black text-white px-3 py-2 rounded">
          Skip to content
        </a>

        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-black/5">
          <div className="mx-auto max-w-2xl px-4 h-14 flex items-center">
            {/* Replace any <Logo/> or "TP" with this link */}
            <Link href="/" className="text-base font-semibold tracking-tight">
              TicketPay
            </Link>
          </div>
        </header>

        <main id="main">{children}</main>
      </body>
    </html>
  );
}
