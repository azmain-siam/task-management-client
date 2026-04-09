"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { getUserDisplayName } from "@/lib/helpers";
import { ApiUser, Role } from "@/types";

type NavItem = { label: string; href: string };

type Props = {
  role: Role;
  user: ApiUser;
  onLogout: () => void;
  children: ReactNode;
};

export function DashboardShell({ role, user, onLogout, children }: Props) {
  const pathname = usePathname();
  const navItems: NavItem[] =
    role === "ADMIN"
      ? [
          { label: "Dashboard", href: "/admin/tasks" },
          { label: "Audit Logs", href: "/admin/audit" },
        ]
      : [{ label: "My Tasks", href: "/user/tasks" }];

  return (
    <main className="min-h-screen bg-[#eef1f7] p-4">
      <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-[220px_1fr]">
        <aside className="rounded bg-blue-700 text-white shadow-sm">
          <div className="border-b border-blue-500 px-4 py-4 text-sm font-semibold">
            {role === "ADMIN" ? "Admin Dashboard" : "User Dashboard"}
          </div>
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-4 py-3 text-sm transition ${
                  active ? "bg-blue-800" : "hover:bg-blue-600"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <div className="mt-8 border-t border-blue-500 px-4 py-4 text-xs">
            <p>{getUserDisplayName(user)}</p>
            <p className="text-blue-200">{user.email}</p>
            <button
              className="mt-3 rounded bg-white/15 px-3 py-1.5 text-xs hover:bg-white/25"
              onClick={onLogout}
            >
              Logout
            </button>
          </div>
        </aside>
        <section className="rounded border border-zinc-200 bg-white p-4 shadow-sm md:p-6">
          {children}
        </section>
      </div>
    </main>
  );
}
