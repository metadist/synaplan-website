import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = { title: "Login" };

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 text-center">
          <span className="gradient-text text-2xl font-bold tracking-tight">
            Synaplan
          </span>
          <p className="mt-1 text-sm text-muted-foreground">Admin Dashboard</p>
        </div>

        <div className="rounded-2xl border bg-background p-6 shadow-sm">
          <h1 className="mb-6 text-lg font-semibold">Sign in</h1>
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
