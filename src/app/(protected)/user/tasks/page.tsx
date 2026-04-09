"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { TaskDetails } from "@/components/tasks/task-details";
import { TasksTable } from "@/components/tasks/tasks-table";
import { useAuth } from "@/context/auth-context";
import { apiRequest } from "@/lib/api";
import { extractArray } from "@/lib/helpers";
import { Task, TaskStatus } from "@/types";

export default function UserTasksPage() {
  const router = useRouter();
  const { token, role, loading: authLoading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const selectedTask = useMemo(
    () => tasks.find((task) => task.id === selectedTaskId) ?? null,
    [selectedTaskId, tasks]
  );

  useEffect(() => {
    if (!authLoading && role === "ADMIN") {
      router.replace("/admin/tasks");
    }
  }, [authLoading, role, router]);

  async function loadTasks() {
    setLoading(true);
    setError("");
    try {
      const payload = await apiRequest<Task[] | { items: Task[] }>("/api/tasks/my", token);
      setTasks(extractArray<Task>(payload));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!token || role !== "USER") return;
    void loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, role]);

  async function updateTaskStatus(taskId: string, status: TaskStatus) {
    setLoading(true);
    setError("");
    try {
      await apiRequest(`/api/tasks/${taskId}`, token, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      await loadTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update task status");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <header className="mb-4 flex items-center justify-between gap-3 border-b border-zinc-200 pb-3">
        <h1 className="text-2xl font-semibold text-zinc-800">My Tasks</h1>
        <button
          className="rounded bg-zinc-200 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-300"
          onClick={loadTasks}
        >
          Refresh
        </button>
      </header>

      {error ? <p className="mb-4 rounded bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}

      <TasksTable
        tasks={tasks}
        role="USER"
        loading={loading}
        onPickTask={(task) => setSelectedTaskId(task.id)}
        onEdit={() => undefined}
        onDelete={() => undefined}
        onStatusChange={updateTaskStatus}
      />

      <TaskDetails task={selectedTask} />
    </>
  );
}
