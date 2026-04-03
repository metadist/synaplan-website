import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = { title: "Login" };

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-[420px] lg:flex-col lg:justify-between bg-[#0e1120] p-10">
        <div className="flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/synaplan_logo.svg" alt="Synaplan" className="h-7 opacity-90" />
        </div>

        <div>
          <blockquote className="text-white/70 text-sm leading-relaxed">
            "The open-source AI platform for teams that care about privacy, control, and results."
          </blockquote>
          <p className="mt-4 text-xs text-white/30">Synaplan · metadist data management GmbH</p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 flex-col items-center justify-center bg-[#f8f9fc] px-6 py-12">
        {/* Mobile logo */}
        <div className="mb-10 lg:hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/synaplan_logo.svg" alt="Synaplan" className="h-7 brightness-0" />
        </div>

        <div className="w-full max-w-[360px]">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
              Sign in
            </h1>
            <p className="mt-1.5 text-sm text-gray-500">
              Enter your credentials to access the admin panel.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm">
            <Suspense fallback={null}>
              <LoginForm />
            </Suspense>
          </div>

          <p className="mt-8 text-center text-xs text-gray-400">
            © {new Date().getFullYear()} Synaplan · All rights reserved
          </p>
        </div>
      </div>
    </div>
  );
}
