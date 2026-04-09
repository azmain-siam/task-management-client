const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

function sanitizeBaseUrl() {
  return API_BASE_URL.replace(/\/$/, "");
}

function buildUrl(path: string) {
  const base = sanitizeBaseUrl();
  if (!base) return path;

  if (base.endsWith("/api") && path.startsWith("/api")) {
    return `${base}${path.slice(4)}`;
  }

  return `${base}${path}`;
}

export async function apiRequest<T>(
  path: string,
  token: string,
  init?: RequestInit
): Promise<T> {
  const headers = new Headers(init?.headers);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(buildUrl(path), {
    ...init,
    headers,
  });

  if (!response.ok) {
    let message = "Request failed";
    try {
      const data = (await response.json()) as { message?: string };
      message = data?.message ?? message;
    } catch {
      // ignore invalid JSON body
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export function getPublicApiUrl(path: string) {
  return buildUrl(path);
}
