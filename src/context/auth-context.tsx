"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { clearAuthStorage, getStoredToken, setAuthStorage } from "@/lib/auth-storage";
import { apiRequest, getPublicApiUrl } from "@/lib/api";
import { toRole } from "@/lib/helpers";
import { ApiUser, Role } from "@/types";

type LoginResponse = {
  data?: {
    user?: ApiUser;
    token?: string;
  };
  token?: string;
  accessToken?: string;
};

function normalizeUser(user?: ApiUser | null): ApiUser | null {
  if (!user || !user.id) return null;
  return {
    ...user,
    name: user.name ?? user.fullName,
  };
}

function extractUserFromPayload(payload: unknown): ApiUser | null {
  if (!payload || typeof payload !== "object") return null;
  const record = payload as Record<string, unknown>;

  const directUser = normalizeUser(record as ApiUser);
  if (directUser) return directUser;

  if (record.user && typeof record.user === "object") {
    const user = normalizeUser(record.user as ApiUser);
    if (user) return user;
  }

  if (record.data && typeof record.data === "object") {
    const dataRecord = record.data as Record<string, unknown>;

    if (dataRecord.user && typeof dataRecord.user === "object") {
      const user = normalizeUser(dataRecord.user as ApiUser);
      if (user) return user;
    }

    const user = normalizeUser(dataRecord as ApiUser);
    if (user) return user;
  }

  return null;
}

type AuthContextValue = {
  token: string;
  user: ApiUser | null;
  role: Role | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<Role>;
  logout: () => void;
  refreshMe: () => Promise<ApiUser | null>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState(() => getStoredToken());
  const [user, setUser] = useState<ApiUser | null>(null);
  const [loading, setLoading] = useState(() => Boolean(getStoredToken()));

  async function fetchMe(currentToken: string) {
    try {
      const mePayload = await apiRequest<unknown>("/api/auth/me", currentToken);
      const me = extractUserFromPayload(mePayload);
      if (!me) {
        throw new Error("Invalid /auth/me response");
      }
      const role = toRole(me);
      setUser(me);
      setAuthStorage(currentToken, role);
      return me;
    } catch {
      clearAuthStorage();
      setToken("");
      setUser(null);
      return null;
    }
  }

  useEffect(() => {
    if (!token) return;
    void fetchMe(token).finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!token) {
      setLoading(false);
    }
  }, [token]);

  async function login(email: string, password: string) {
    const payload = await fetch(getPublicApiUrl("/api/auth/login"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!payload.ok) {
      throw new Error("Invalid credentials");
    }

    const response = (await payload.json()) as LoginResponse;
    const nextToken =
      response.data?.token ?? response.accessToken ?? response.token ?? "";
    if (!nextToken) {
      throw new Error("Token not found in login response");
    }

    setToken(nextToken);
    const loginUser = extractUserFromPayload(response);
    if (loginUser) {
      setUser(loginUser);
    }
    const me = loginUser ?? (await fetchMe(nextToken));
    const role = toRole(me);
    setAuthStorage(nextToken, role);
    return role;
  }

  function logout() {
    clearAuthStorage();
    setToken("");
    setUser(null);
  }

  async function refreshMe() {
    if (!token) return null;
    return fetchMe(token);
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        role: user ? toRole(user) : null,
        loading,
        login,
        logout,
        refreshMe,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
