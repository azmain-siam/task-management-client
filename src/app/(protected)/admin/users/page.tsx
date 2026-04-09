"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { apiRequest } from "@/lib/api";
import { extractArray, formatDateTime, getUserDisplayName } from "@/lib/helpers";
import { ApiUser, Task } from "@/types";

type UserRow = ApiUser & { taskCount: number; lastTaskUpdate?: string };

export default function AdminUsersPage() {
  const router = useRouter();
  const { token, role, loading: authLoading } = useAuth();
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && role === "USER") {
      router.replace("/user/tasks");
    }
  }, [authLoading, role, router]);

  async function loadData() {
    setLoading(true);
    setError("");
    try {
      const [usersPayload, tasksPayload] = await Promise.allSettled([
        apiRequest<ApiUser[] | { items: ApiUser[] }>("/api/user", token),
        apiRequest<Task[] | { items: Task[] }>("/api/tasks", token),
      ]);

      if (tasksPayload.status === "fulfilled") {
        setTasks(extractArray<Task>(tasksPayload.value));
      } else {
        setTasks([]);
      }

      if (usersPayload.status === "fulfilled") {
        setUsers(extractArray<ApiUser>(usersPayload.value));
      } else if (tasksPayload.status === "fulfilled") {
        const fromTasks = extractArray<Task>(tasksPayload.value)
          .map((task) => task.assignedTo)
          .filter((item): item is ApiUser => Boolean(item?.id));
        const unique = Array.from(new Map(fromTasks.map((u) => [u.id, u])).values());
        setUsers(unique);
      } else {
        throw new Error("Unable to load users");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!token || role !== "ADMIN") return;
    void loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, role]);

  const userRows = useMemo<UserRow[]>(() => {
    return users.map((user) => {
      const assigned = tasks.filter((task) => task.assignedToId === user.id);
      const lastUpdate = assigned
        .map((task) => task.updatedAt)
        .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0];

      return {
        ...user,
        taskCount: assigned.length,
        lastTaskUpdate: lastUpdate,
      };
    });
  }, [users, tasks]);

  return (
    <>
      <header className="mb-5 flex items-center justify-between border-b border-slate-200 pb-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Users</h1>
          <p className="mt-1 text-sm text-slate-600">Manage and monitor system users.</p>
        </div>
        <button
          className="rounded-md bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 ring-1 ring-slate-200 hover:bg-slate-200"
          onClick={loadData}
          disabled={loading}
        >
          Refresh
        </button>
      </header>

      {error ? <p className="mb-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p> : null}

      <div className="overflow-x-auto">
        <table className="w-full overflow-hidden rounded-xl border border-slate-200 text-sm text-slate-800">
          <thead className="bg-slate-100 text-left text-slate-700">
            <tr>
              <th className="border-b border-slate-200 p-3 font-semibold">Name</th>
              <th className="border-b border-slate-200 p-3 font-semibold">Email</th>
              <th className="border-b border-slate-200 p-3 font-semibold">Role</th>
              <th className="border-b border-slate-200 p-3 font-semibold">Assigned Tasks</th>
              <th className="border-b border-slate-200 p-3 font-semibold">Last Task Update</th>
            </tr>
          </thead>
          <tbody>
            {userRows.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50">
                <td className="border-b border-slate-200 p-3 font-medium text-slate-900">
                  {getUserDisplayName(user)}
                </td>
                <td className="border-b border-slate-200 p-3 text-slate-700">{user.email}</td>
                <td className="border-b border-slate-200 p-3">{(user.role ?? "USER").toUpperCase()}</td>
                <td className="border-b border-slate-200 p-3">{user.taskCount}</td>
                <td className="border-b border-slate-200 p-3 text-slate-600">
                  {user.lastTaskUpdate ? formatDateTime(user.lastTaskUpdate) : "-"}
                </td>
              </tr>
            ))}
            {userRows.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-slate-500">
                  No users found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </>
  );
}
