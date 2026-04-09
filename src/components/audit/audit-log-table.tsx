import { formatDateTime, getActorName } from "@/lib/helpers";
import { AuditLog } from "@/types";

export function AuditLogTable({ auditLogs }: { auditLogs: AuditLog[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full overflow-hidden rounded-xl border border-slate-200 text-sm text-slate-800">
        <thead className="bg-slate-100 text-left text-slate-700">
          <tr>
            <th className="border-b border-slate-200 p-3 font-semibold">Timestamp</th>
            <th className="border-b border-slate-200 p-3 font-semibold">User</th>
            <th className="border-b border-slate-200 p-3 font-semibold">Action</th>
            <th className="border-b border-slate-200 p-3 font-semibold">Target</th>
            <th className="border-b border-slate-200 p-3 font-semibold">Details</th>
          </tr>
        </thead>
        <tbody>
          {auditLogs.map((log) => (
            <tr key={log.id} className="hover:bg-slate-50">
              <td className="border-b border-slate-200 p-3 text-slate-600">{formatDateTime(log.createdAt)}</td>
              <td className="border-b border-slate-200 p-3 text-slate-900">{getActorName(log)}</td>
              <td className="border-b border-slate-200 p-3">{log.actionType ?? log.action ?? "-"}</td>
              <td className="border-b border-slate-200 p-3">
                {log.targetEntity ?? log.entityType ?? "task"} {log.targetId ? `(${log.targetId})` : ""}
              </td>
              <td className="border-b border-slate-200 p-3 text-xs text-slate-700">
                {typeof log.details === "string"
                  ? log.details
                  : JSON.stringify(log.details ?? log.metadata ?? {})}
              </td>
            </tr>
          ))}
          {auditLogs.length === 0 ? (
            <tr>
              <td className="p-4 text-center text-slate-500" colSpan={5}>
                No audit logs found.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
