import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lumina | Confidential Escrow",
  description: "Zero-Knowledge Whistleblower Escrow on Stellar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-900 text-white min-h-screen flex flex-col`}>
        <nav className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex-shrink-0 flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-neon rounded-full flex items-center justify-center opacity-80 animate-pulse">
                  <span className="text-slate-900 font-bold">L</span>
                </div>
                <span className="font-bold text-xl tracking-tight">Lumina</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="flex items-center text-xs font-medium bg-slate-700 px-2 py-1 rounded-full text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-green-neon mr-2"></span>
                  Stellar Testnet
                </span>
                <button className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                  Connect Freighter
                </button>
              </div>
            </div>
          </div>
        </nav>
        <main className="flex-grow max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </body>
    </html>
  );
}
