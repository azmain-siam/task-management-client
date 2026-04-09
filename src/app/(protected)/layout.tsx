"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { useAuth } from "@/context/auth-context";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, role, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading || !user || !role) {
    return (
      <main className="min-h-screen bg-[#eef1f7] flex items-center justify-center">
        <p className="text-sm text-zinc-600">Loading...</p>
      </main>
    );
  }

  return (
    <DashboardShell
      role={role}
      user={user}
      onLogout={() => {
        logout();
        router.replace("/login");
      }}
    >
      {children}
    </DashboardShell>
  );
}
