"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuditLogTable } from "@/components/audit/audit-log-table";
import { useAuth } from "@/context/auth-context";
import { apiRequest } from "@/lib/api";
import { extractArray } from "@/lib/helpers";
import { AuditLog } from "@/types";

export default function AdminAuditPage() {
  const router = useRouter();
  const { token, role, loading: authLoading } = useAuth();
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && role === "USER") {
      router.replace("/user/tasks");
    }
  }, [authLoading, role, router]);

  async function loadAuditLogs() {
    setLoading(true);
    setError("");
    try {
      const payload = await apiRequest<AuditLog[] | { items: AuditLog[] }>(
        "/api/audit/logs",
        token
      );
      setAuditLogs(extractArray<AuditLog>(payload));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load audit logs");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!token || role !== "ADMIN") return;
    void loadAuditLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, role]);

  return (
    <>
      <header className="mb-4 flex items-center justify-between gap-3 border-b border-zinc-200 pb-3">
        <h1 className="text-2xl font-semibold text-zinc-800">Audit Log</h1>
        <button
          className="rounded bg-zinc-200 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-300"
          onClick={loadAuditLogs}
          disabled={loading}
        >
          Refresh
        </button>
      </header>
      {error ? <p className="mb-4 rounded bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
      <AuditLogTable auditLogs={auditLogs} />
    </>
  );
}
