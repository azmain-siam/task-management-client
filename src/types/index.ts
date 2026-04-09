export type Role = "ADMIN" | "USER";
export type TaskStatus = "IN PROGRESS" | "TODO" | "DONE";

export type ApiUser = {
  id: string;
  email: string;
  name?: string;
  fullName?: string;
  role?: string;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignedToId?: string | null;
  assignedTo?: ApiUser | null;
  createdAt: string;
  updatedAt: string;
};

export type AuditLog = {
  id: string;
  actor?: ApiUser | null;
  actorId?: string;
  actionType?: string;
  action?: string;
  entityType?: string;
  targetEntity?: string;
  targetId?: string;
  details?: string | Record<string, unknown>;
  metadata?: Record<string, unknown>;
  createdAt: string;
};
