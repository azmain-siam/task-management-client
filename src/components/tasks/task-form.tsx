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
      className="mb-6 grid gap-3 rounded border border-zinc-200 p-4 md:grid-cols-2"
    >
      <input
        className="rounded border border-zinc-300 px-3 py-2 text-sm text-zinc-900"
        placeholder="Title"
        value={value.title}
        onChange={(event) => onChange({ ...value, title: event.target.value })}
      />
      <input
        className="rounded border border-zinc-300 px-3 py-2 text-sm text-zinc-900"
        placeholder="Assigned User ID"
        value={value.assignedToId}
        onChange={(event) => onChange({ ...value, assignedToId: event.target.value })}
        list="user-options"
      />
      <textarea
        className="rounded border border-zinc-300 px-3 py-2 text-sm text-zinc-900 md:col-span-2"
        placeholder="Description"
        value={value.description}
        onChange={(event) => onChange({ ...value, description: event.target.value })}
        rows={3}
      />
      <datalist id="user-options">
        {users.map((item) => (
          <option key={item.id} value={item.id}>
            {getUserDisplayName(item)}
          </option>
        ))}
      </datalist>
      <div className="md:col-span-2 flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {editing ? "Update Task" : "Create Task"}
        </button>
        {editing ? (
          <button
            type="button"
            onClick={onCancel}
            className="rounded bg-zinc-200 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-300"
          >
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}
