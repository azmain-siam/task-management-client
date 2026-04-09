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
          { label: "Tasks", href: "/admin/tasks" },
          { label: "Users", href: "/admin/users" },
          { label: "Audit Logs", href: "/admin/audit" },
        ]
      : [
          { label: "My Tasks", href: "/user/tasks" },
          { label: "Profile", href: "/user/profile" },
        ];

  return (
    <main className="min-h-screen bg-slate-100 p-4 md:p-6">
      <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-[240px_1fr]">
        <aside className="rounded-2xl bg-slate-900 text-slate-100 shadow-xl ring-1 ring-slate-800">
          <div className="border-b border-slate-700 px-5 py-5 text-sm font-semibold tracking-wide">
            {role === "ADMIN" ? "Admin Dashboard" : "User Dashboard"}
          </div>
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`mx-3 mt-3 block rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-indigo-500 text-white"
                    : "text-slate-200 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <div className="mt-8 border-t border-slate-700 px-5 py-4 text-xs text-slate-300">
            <p className="text-sm font-medium text-slate-100">{getUserDisplayName(user)}</p>
            <p className="mt-1 text-slate-400">{user.email}</p>
            <button
              className="mt-3 rounded-md bg-slate-800 px-3 py-1.5 text-xs font-medium hover:bg-slate-700"
              onClick={onLogout}
            >
              Logout
            </button>
          </div>
        </aside>
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
          {children}
        </section>
      </div>
    </main>
  );
}
