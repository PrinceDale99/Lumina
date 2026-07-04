import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import WalletConnect from "@/components/WalletConnect";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lumina | Zero-Knowledge Escrow",
  description: "Cryptographically shielded whistleblower escrow on Stellar.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-slate-200 min-h-screen flex flex-col relative overflow-x-hidden`} suppressHydrationWarning>
        {/* Premium subtle grid background */}
        <div className="fixed inset-0 z-[-1] bg-background">
          <div className="absolute top-0 inset-x-0 h-[600px] bg-gradient-to-b from-cyan-neon/5 via-background to-background pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,240,255,0.05),transparent)] pointer-events-none" />
        </div>
        <nav className="border-b border-white/5 bg-background/60 backdrop-blur-xl sticky top-0 z-50 transition-all">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-20 items-center">
              <Link href="/" className="flex-shrink-0 flex items-center space-x-3 group cursor-pointer">
                <div className="w-10 h-10 bg-surface border border-white/10 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.2)] group-hover:shadow-[0_0_25px_rgba(0,240,255,0.4)] transition-all duration-300">
                  <span className="text-cyan-neon font-black text-xl">L</span>
                </div>
                <span className="font-extrabold text-2xl tracking-tighter text-white group-hover:text-cyan-neon transition-colors duration-300">Lumina</span>
              </Link>
              <div className="flex items-center space-x-8">
                <Link href="/docs" className="text-slate-400 hover:text-cyan-neon transition-colors text-sm font-semibold tracking-wide">
                  How it Works
                </Link>
                <div className="flex items-center space-x-4">
                  <span className="flex items-center text-xs font-bold bg-surface border border-white/10 px-3 py-1.5 rounded-full text-slate-300 shadow-inner">
                    <span className="w-2 h-2 rounded-full bg-green-neon mr-2 animate-pulse"></span>
                    Testnet
                  </span>
                  <WalletConnect />
                </div>
              </div>
            </div>
          </div>
        </nav>
        <main className="flex-grow max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 relative z-10">
          {children}
        </main>
      </body>
    </html>
  );
}
