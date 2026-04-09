import { formatDateTime } from "@/lib/helpers";
import { Task } from "@/types";

export function TaskDetails({ task }: { task: Task | null }) {
  if (!task) return null;

  return (
    <div className="mt-5 rounded border border-zinc-200 bg-zinc-50 p-4">
      <h2 className="mb-2 text-lg font-semibold text-zinc-800">{task.title}</h2>
      <p className="mb-2 text-sm text-zinc-700">{task.description}</p>
      <p className="text-xs text-zinc-500">
        Created: {formatDateTime(task.createdAt)} | Updated: {formatDateTime(task.updatedAt)}
      </p>
    </div>
  );
}
