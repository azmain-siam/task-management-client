import { ApiUser, AuditLog, Role } from "@/types";

export function toRole(user: ApiUser | null): Role {
  const roleValue = (user?.role ?? "").toUpperCase();
  return roleValue === "ADMIN" ? "ADMIN" : "USER";
}

export function extractArray<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (payload && typeof payload === "object") {
    const maybeItems = payload as { items?: unknown; data?: unknown };
    if (Array.isArray(maybeItems.items)) return maybeItems.items as T[];
    if (Array.isArray(maybeItems.data)) return maybeItems.data as T[];
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
