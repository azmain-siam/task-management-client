import { ApiUser, AuditLog, Role } from "@/types";

export function toRole(user: ApiUser | null): Role {
  const roleValue = (user?.role ?? "").toUpperCase();
  return roleValue === "ADMIN" ? "ADMIN" : "USER";
}

export function extractArray<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    const directKeys = ["items", "data", "users", "tasks", "logs", "results"];

    for (const key of directKeys) {
      if (Array.isArray(record[key])) return record[key] as T[];
    }

    const nestedData = record.data;
    if (nestedData && typeof nestedData === "object") {
      const nested = nestedData as Record<string, unknown>;
      for (const key of directKeys) {
        if (Array.isArray(nested[key])) return nested[key] as T[];
      }
    }
  }
  return [];
}

export function formatDateTime(value: string) {
  if (!value) return "-";
  return new Date(value).toLocaleString();
}

export function getActorName(log: AuditLog) {
  if (log.actor?.name) return log.actor.name;
  if (log.actor?.fullName) return log.actor.fullName;
  if (log.actor?.email) return log.actor.email;
  if (log.actorId) return log.actorId;
  return "Unknown";
}

export function getUserDisplayName(user?: ApiUser | null) {
  if (!user) return "";
  return user.name ?? user.fullName ?? user.email;
}
