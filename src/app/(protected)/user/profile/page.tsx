"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { apiRequest } from "@/lib/api";
import { extractArray, getUserDisplayName } from "@/lib/helpers";
import { Task } from "@/types";

export default function UserProfilePage() {
  const router = useRouter();
  const { token, role, user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (role === "ADMIN") {
      router.replace("/admin/tasks");
    }
  }, [role, router]);

  async function loadMyTasks() {
    if (!token) return;
    setLoading(true);
    try {
      const payload = await apiRequest<Task[] | { items: Task[] }>("/api/tasks/my", token);
      setTasks(extractArray<Task>(payload));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!token || role !== "USER") return;
    void loadMyTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, role]);

  const stats = useMemo(() => {
    return {
      total: tasks.length,
      pending: tasks.filter((task) => task.status === "PENDING").length,
      processing: tasks.filter((task) => task.status === "PROCESSING").length,
      done: tasks.filter((task) => task.status === "DONE").length,
    };
  }, [tasks]);

  return (
    <>
      <header className="mb-5 border-b border-slate-200 pb-3">
        <h1 className="text-2xl font-semibold text-slate-900">Profile</h1>
        <p className="mt-1 text-sm text-slate-600">Your account information and task summary.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Account
          </h2>
          <div className="space-y-2 text-sm text-slate-700">
            <p>
              <span className="font-semibold text-slate-900">Name:</span> {getUserDisplayName(user)}
            </p>
            <p>
              <span className="font-semibold text-slate-900">Email:</span> {user?.email}
            </p>
            <p>
              <span className="font-semibold text-slate-900">Role:</span> {user?.role ?? "USER"}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              My Task Stats
            </h2>
            <button
              className="rounded-md bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 ring-1 ring-slate-200 hover:bg-slate-200"
              onClick={loadMyTasks}
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Total</p>
              <p className="text-xl font-semibold text-slate-900">{stats.total}</p>
            </div>
            <div className="rounded-lg bg-amber-50 p-3">
              <p className="text-xs text-amber-700">Pending</p>
              <p className="text-xl font-semibold text-amber-900">{stats.pending}</p>
            </div>
            <div className="rounded-lg bg-blue-50 p-3">
              <p className="text-xs text-blue-700">Processing</p>
              <p className="text-xl font-semibold text-blue-900">{stats.processing}</p>
            </div>
            <div className="rounded-lg bg-emerald-50 p-3">
              <p className="text-xs text-emerald-700">Done</p>
              <p className="text-xl font-semibold text-emerald-900">{stats.done}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
