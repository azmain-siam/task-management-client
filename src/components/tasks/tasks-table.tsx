"use client";

import { formatDateTime, getUserDisplayName } from "@/lib/helpers";
import { Role, Task, TaskStatus } from "@/types";

type Props = {
  tasks: Task[];
  role: Role;
  loading: boolean;
  onPickTask: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
};

export function TasksTable({
  tasks,
  role,
  loading,
  onPickTask,
  onEdit,
  onDelete,
  onStatusChange,
}: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border border-zinc-200 text-sm">
        <thead className="bg-zinc-100 text-left text-zinc-700">
          <tr>
            <th className="border-b border-zinc-200 p-2">Title</th>
            {role === "ADMIN" ? (
              <th className="border-b border-zinc-200 p-2">Assignee</th>
            ) : null}
            <th className="border-b border-zinc-200 p-2">Status</th>
            <th className="border-b border-zinc-200 p-2">Updated</th>
            <th className="border-b border-zinc-200 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id} className="hover:bg-zinc-50">
              <td className="border-b border-zinc-200 p-2">
                <button
                  className="text-left text-blue-700 hover:underline"
                  onClick={() => onPickTask(task)}
                >
                  {task.title}
                </button>
              </td>
              {role === "ADMIN" ? (
                <td className="border-b border-zinc-200 p-2">
                  {getUserDisplayName(task.assignedTo) || task.assignedToId || "-"}
                </td>
              ) : null}
              <td className="border-b border-zinc-200 p-2">
                <select
                  className="rounded border border-zinc-300 px-2 py-1 text-sm"
                  value={task.status}
                  onChange={(event) =>
                    onStatusChange(task.id, event.target.value as TaskStatus)
                  }
                  disabled={loading}
                >
                  <option value="PENDING">PENDING</option>
                  <option value="PROCESSING">PROCESSING</option>
                  <option value="DONE">DONE</option>
                </select>
              </td>
              <td className="border-b border-zinc-200 p-2">{formatDateTime(task.updatedAt)}</td>
              <td className="border-b border-zinc-200 p-2">
                <div className="flex gap-2">
                  {role === "ADMIN" ? (
                    <>
                      <button
                        className="text-blue-700 hover:underline"
                        onClick={() => onEdit(task)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-700 hover:underline"
                        onClick={() => onDelete(task.id)}
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <button
                      className="text-blue-700 hover:underline"
                      onClick={() => onPickTask(task)}
                    >
                      View
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
          {tasks.length === 0 ? (
            <tr>
              <td
                className="p-4 text-center text-zinc-500"
                colSpan={role === "ADMIN" ? 5 : 4}
              >
                No tasks found.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
