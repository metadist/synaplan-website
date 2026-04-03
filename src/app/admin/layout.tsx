/**
 * Admin root layout — standalone (no site header/footer).
 * Uses Inter for clean dashboard typography, independent of the marketing site font.
 */
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import "@/app/globals.css";

const inter = Inter({
  variable: "--font-admin",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: { default: "Admin — Synaplan", template: "%s — Synaplan Admin" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} bg-background text-foreground antialiased`}
        style={{ fontFamily: "var(--font-admin), system-ui, sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
