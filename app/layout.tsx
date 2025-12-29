import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import NextAuthSessionProvider from "@/components/session-provider-wrapper";
import { AuthButton } from "@/components/auth-button";
import Image from "next/image";
import Link from "next/link";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ChalkItUp",
  description: "Group expense tracking app.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthSessionProvider>
          {/* ------------------ HEADER WITH AUTH BUTTON ------------------ */}
          <header className="shadow-md bg-[#222121] nav">
            <nav className="max-w-7xl mx-auto p-4 flex justify-between items-center">
              <Link href="/">
                <div className="flex items-center space-x-2">
                  <Image
                    id="logo"
                    src="/ChalkItUp_White_Logo.png"
                    alt="ChalkItUp Logo"
                    width={100}
                    height={100}
                    priority={true}
                  />
                </div>
              </Link>

              <AuthButton />
            </nav>
          </header>
          {/* --------------------------------------------------- */}

          <main className="min-h-[90vh]">{children}</main>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
