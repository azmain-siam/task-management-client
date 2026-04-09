"use client";

import { FormEvent } from "react";
import { getUserDisplayName } from "@/lib/helpers";
import { ApiUser } from "@/types";

type TaskFormValue = {
  title: string;
  description: string;
  assignedToId: string;
};

type Props = {
  value: TaskFormValue;
  users: ApiUser[];
  editing: boolean;
  loading: boolean;
  onChange: (value: TaskFormValue) => void;
  onSubmit: (event: FormEvent) => void;
  onCancel: () => void;
};

export function TaskForm({
  value,
  users,
  editing,
  loading,
  onChange,
  onSubmit,
  onCancel,
}: Props) {
  return (
    <form
      onSubmit={onSubmit}
      className="mb-6 grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-2"
    >
      <input
        className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
        placeholder="Title"
        value={value.title}
        onChange={(event) => onChange({ ...value, title: event.target.value })}
      />
      <select
        className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
        value={value.assignedToId}
        onChange={(event) => onChange({ ...value, assignedToId: event.target.value })}
      >
        <option value="">Select assignee</option>
        {users.map((item) => (
          <option key={item.id} value={item.id}>
            {getUserDisplayName(item)}
          </option>
        ))}
      </select>
      <textarea
        className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 md:col-span-2"
        placeholder="Description"
        value={value.description}
        onChange={(event) => onChange({ ...value, description: event.target.value })}
        rows={3}
      />
      <div className="md:col-span-2 flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {editing ? "Update Task" : "Create Task"}
        </button>
        {editing ? (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md bg-white px-4 py-2 text-sm text-slate-700 ring-1 ring-slate-300 hover:bg-slate-100"
          >
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}
