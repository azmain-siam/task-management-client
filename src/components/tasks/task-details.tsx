import { formatDateTime } from "@/lib/helpers";
import { Task } from "@/types";

export function TaskDetails({ task }: { task: Task | null }) {
  if (!task) return null;

  return (
    <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <h2 className="mb-2 text-lg font-semibold text-slate-900">{task.title}</h2>
      <p className="mb-2 text-sm text-slate-700">{task.description}</p>
      <p className="text-xs text-slate-600">
        Created: {formatDateTime(task.createdAt)} | Updated: {formatDateTime(task.updatedAt)}
      </p>
    </div>
  );
}
