/**
 * Admin root layout — standalone (no site header/footer).
 * Session is handled by middleware; pages can assume user is authenticated.
 */
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: { default: "Admin — Synaplan", template: "%s — Synaplan Admin" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
