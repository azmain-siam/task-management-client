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
      <table className="w-full overflow-hidden rounded-xl border border-slate-200 text-sm text-slate-800">
        <thead className="bg-slate-100 text-left text-slate-700">
          <tr>
            <th className="border-b border-slate-200 p-3 font-semibold">Title</th>
            {role === "ADMIN" ? (
              <th className="border-b border-slate-200 p-3 font-semibold">Assignee</th>
            ) : null}
            <th className="border-b border-slate-200 p-3 font-semibold">Status</th>
            <th className="border-b border-slate-200 p-3 font-semibold">Updated</th>
            <th className="border-b border-slate-200 p-3 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id} className="hover:bg-slate-50">
              <td className="border-b border-slate-200 p-3 text-slate-900">
                <button
                  className="text-left font-medium text-indigo-700 hover:underline"
                  onClick={() => onPickTask(task)}
                >
                  {task.title}
                </button>
              </td>
              {role === "ADMIN" ? (
                <td className="border-b border-slate-200 p-3 text-slate-700">
                  {getUserDisplayName(task.assignedTo) || task.assignedToId || "-"}
                </td>
              ) : null}
              <td className="border-b border-slate-200 p-3">
                <select
                  className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm text-slate-800"
                  value={task.status}
                  onChange={(event) =>
                    onStatusChange(task.id, event.target.value as TaskStatus)
                  }
                  disabled={loading}
                >
                  <option value="IN_PROGRESS">IN PROGRESS</option>
                  <option value="TODO">TODO</option>
                  <option value="DONE">DONE</option>
                </select>
              </td>
              <td className="border-b border-slate-200 p-3 text-slate-600">{formatDateTime(task.updatedAt)}</td>
              <td className="border-b border-slate-200 p-3">
                <div className="flex gap-2">
                  {role === "ADMIN" ? (
                    <>
                      <button
                        className="text-indigo-700 hover:underline"
                        onClick={() => onEdit(task)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-rose-700 hover:underline"
                        onClick={() => onDelete(task.id)}
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <button
                      className="text-indigo-700 hover:underline"
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
                className="p-4 text-center text-slate-500"
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
