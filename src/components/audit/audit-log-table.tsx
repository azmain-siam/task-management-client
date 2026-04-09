import { formatDateTime, getActorName } from "@/lib/helpers";
import { AuditLog } from "@/types";

export function AuditLogTable({ auditLogs }: { auditLogs: AuditLog[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border border-zinc-200 text-sm">
        <thead className="bg-zinc-100 text-left text-zinc-700">
          <tr>
            <th className="border-b border-zinc-200 p-2">Timestamp</th>
            <th className="border-b border-zinc-200 p-2">User</th>
            <th className="border-b border-zinc-200 p-2">Action</th>
            <th className="border-b border-zinc-200 p-2">Target</th>
            <th className="border-b border-zinc-200 p-2">Details</th>
          </tr>
        </thead>
        <tbody>
          {auditLogs.map((log) => (
            <tr key={log.id} className="hover:bg-zinc-50">
              <td className="border-b border-zinc-200 p-2">{formatDateTime(log.createdAt)}</td>
              <td className="border-b border-zinc-200 p-2">{getActorName(log)}</td>
              <td className="border-b border-zinc-200 p-2">{log.actionType ?? log.action ?? "-"}</td>
              <td className="border-b border-zinc-200 p-2">
                {log.targetEntity ?? log.entityType ?? "task"} {log.targetId ? `(${log.targetId})` : ""}
              </td>
              <td className="border-b border-zinc-200 p-2 text-xs text-zinc-700">
                {typeof log.details === "string"
                  ? log.details
                  : JSON.stringify(log.details ?? log.metadata ?? {})}
              </td>
            </tr>
          ))}
          {auditLogs.length === 0 ? (
            <tr>
              <td className="p-4 text-center text-zinc-500" colSpan={5}>
                No audit logs found.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
