import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ChalkItUp",
  description: "Settle up with the squad",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <header className="fixed top-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-sm z-50 border-b">
          <nav aria-label="Main navigation" className="max-w-6xl mx-auto h-full flex items-center px-4">
            <Link href="/" className="text-2xl font-bold px-4 py-2 block">
              ChalkItUp
            </Link>
          </nav>
        </header>

        <main className="pt-16 pb-12">
          {children}
        </main>

        <footer className="fixed bottom-0 left-0 right-0 h-12 bg-white/90 backdrop-blur-sm z-50 border-t">
          <div className="max-w-6xl mx-auto h-full flex items-center justify-center px-4 text-sm">
            © {new Date().getFullYear()} ChalkItUp
          </div>
        </footer>
      </body>
    </html>
  );
}
