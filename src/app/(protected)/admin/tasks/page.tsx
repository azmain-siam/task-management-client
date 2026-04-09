"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { TaskDetails } from "@/components/tasks/task-details";
import { TaskForm } from "@/components/tasks/task-form";
import { TasksTable } from "@/components/tasks/tasks-table";
import { useAuth } from "@/context/auth-context";
import { apiRequest } from "@/lib/api";
import { extractArray } from "@/lib/helpers";
import { ApiUser, AuditLog, Task, TaskStatus } from "@/types";

const defaultTaskForm = {
  title: "",
  description: "",
  assignedToId: "",
};

export default function AdminTasksPage() {
  const router = useRouter();
  const { token, role, loading: authLoading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [taskForm, setTaskForm] = useState(defaultTaskForm);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const selectedTask = useMemo(
    () => tasks.find((task) => task.id === selectedTaskId) ?? null,
    [selectedTaskId, tasks]
  );

  useEffect(() => {
    if (!authLoading && role === "USER") {
      router.replace("/user/tasks");
    }
  }, [authLoading, role, router]);

  async function loadTasks() {
    const payload = await apiRequest<Task[] | { items: Task[] }>("/api/tasks", token);
    setTasks(extractArray<Task>(payload));
  }

  async function loadUsers() {
    const normalizeUsers = (list: ApiUser[]) => {
      return Array.from(
        new Map(
          list
            .filter((item) => item?.id)
            .map((item) => [
              item.id,
              {
                ...item,
                name: item.name ?? item.fullName,
              },
            ])
        ).values()
      );
    };

    try {
      const payload = await apiRequest<ApiUser[] | { items: ApiUser[] }>("/api/user", token);
      const usersFromUsersEndpoint = normalizeUsers(extractArray<ApiUser>(payload));
      if (usersFromUsersEndpoint.length > 0) {
        setUsers(usersFromUsersEndpoint);
        return;
      }
    } catch {
      // Continue to fallbacks below.
    }

    try {
      const taskPayload = await apiRequest<Task[] | { items: Task[] }>("/api/tasks", token);
      const usersFromTasks = normalizeUsers(
        extractArray<Task>(taskPayload)
          .map((task) => task.assignedTo)
          .filter((assigned): assigned is ApiUser => Boolean(assigned?.id))
      );

      if (usersFromTasks.length > 0) {
        setUsers(usersFromTasks);
        return;
      }
    } catch {
      // Continue to audit fallback.
    }

    try {
      const auditPayload = await apiRequest<AuditLog[] | { items: AuditLog[] }>(
        "/api/audit/logs",
        token
      );
      const usersFromAudit = normalizeUsers(
        extractArray<AuditLog>(auditPayload)
          .map((log) => log.actor)
          .filter((actor): actor is ApiUser => Boolean(actor?.id))
      );
      setUsers(usersFromAudit);
    } catch {
      setUsers([]);
    }
  }

  async function refreshData() {
    setLoading(true);
    setError("");
    try {
      await Promise.all([loadTasks(), loadUsers()]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!token || role !== "ADMIN") return;
    void refreshData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, role]);

  async function createOrUpdateTask(event: FormEvent) {
    event.preventDefault();
    if (!taskForm.title.trim() || !taskForm.description.trim()) {
      setError("Title and description are required.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const body = {
        title: taskForm.title.trim(),
        description: taskForm.description.trim(),
        ...(taskForm.assignedToId.trim()
          ? { assignedToId: taskForm.assignedToId.trim() }
          : {}),
      };

      if (editingTaskId) {
        await apiRequest(`/api/tasks/${editingTaskId}`, token, {
          method: "PATCH",
          body: JSON.stringify(body),
        });
      } else {
        await apiRequest("/api/tasks", token, {
          method: "POST",
          body: JSON.stringify(body),
        });
      }

      setTaskForm(defaultTaskForm);
      setEditingTaskId(null);
      await refreshData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save task");
    } finally {
      setLoading(false);
    }
  }

  async function deleteTask(taskId: string) {
    setLoading(true);
    setError("");
    try {
      await apiRequest(`/api/tasks/${taskId}`, token, { method: "DELETE" });
      await refreshData();
      if (selectedTaskId === taskId) {
        setSelectedTaskId(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete task");
    } finally {
      setLoading(false);
    }
  }

  async function updateTaskStatus(taskId: string, status: TaskStatus) {
    setLoading(true);
    setError("");
    try {
      await apiRequest(`/api/tasks/${taskId}`, token, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      await refreshData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update task status");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <header className="mb-5 flex items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Task Management</h1>
          <p className="mt-1 text-sm text-slate-600">Create, assign, and maintain tasks.</p>
        </div>
        <button
          className="rounded-md bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 ring-1 ring-slate-200 hover:bg-slate-200"
          onClick={refreshData}
        >
          Refresh
        </button>
      </header>

      {error ? <p className="mb-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p> : null}

      <TaskForm
        value={taskForm}
        users={users}
        editing={Boolean(editingTaskId)}
        loading={loading}
        onChange={setTaskForm}
        onSubmit={createOrUpdateTask}
        onCancel={() => {
          setEditingTaskId(null);
          setTaskForm(defaultTaskForm);
        }}
      />

      <TasksTable
        tasks={tasks}
        role="ADMIN"
        loading={loading}
        onPickTask={(task) => setSelectedTaskId(task.id)}
        onEdit={(task) => {
          setEditingTaskId(task.id);
          setTaskForm({
            title: task.title,
            description: task.description,
            assignedToId: task.assignedToId ?? "",
          });
        }}
        onDelete={deleteTask}
        onStatusChange={updateTaskStatus}
      />

      <TaskDetails task={selectedTask} />
    </>
  );
}
