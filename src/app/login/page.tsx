"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { login, role, loading } = useAuth();
  const [email, setEmail] = useState("admin@petzy.com");
  const [password, setPassword] = useState("12345678");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (loading || !role) return;
    router.replace(role === "ADMIN" ? "/admin/tasks" : "/user/tasks");
  }, [loading, role, router]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const nextRole = await login(email, password);
      router.replace(nextRole === "ADMIN" ? "/admin/tasks" : "/user/tasks");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <h1 className="mb-1 text-3xl font-semibold text-center text-slate-900">Login</h1>
        <p className="mb-6 text-center text-sm text-slate-600">Task Management Dashboard</p>
        <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
        <input
          type="email"
          className="mb-4 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
        <input
          type="password"
          className="mb-5 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-60"
          disabled={submitting}
        >
          {submitting ? "Logging in..." : "Login"}
        </button>
        {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}
      </form>
    </main>
  );
}
