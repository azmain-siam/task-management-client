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
    <main className="min-h-screen bg-[#eef1f7] flex items-center justify-center p-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded border border-zinc-200 bg-white p-6 shadow-sm"
      >
        <h1 className="mb-6 text-3xl font-semibold text-center text-zinc-800">Login</h1>
        <label className="mb-2 block text-sm font-medium text-zinc-700">Email</label>
        <input
          type="email"
          className="mb-4 w-full rounded border border-zinc-300 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-blue-500"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <label className="mb-2 block text-sm font-medium text-zinc-700">Password</label>
        <input
          type="password"
          className="mb-5 w-full rounded border border-zinc-300 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-blue-500"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
          disabled={submitting}
        >
          {submitting ? "Logging in..." : "Login"}
        </button>
        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
      </form>
    </main>
  );
}
