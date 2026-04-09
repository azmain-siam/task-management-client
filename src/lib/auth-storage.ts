"use client";

import { ROLE_KEY, TOKEN_KEY } from "@/lib/constants";

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
}

function clearCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
}

export function setAuthStorage(token: string, role: string) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(ROLE_KEY, role);
  setCookie(TOKEN_KEY, token);
  setCookie(ROLE_KEY, role);
}

export function clearAuthStorage() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
  clearCookie(TOKEN_KEY);
  clearCookie(ROLE_KEY);
}

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY) ?? "";
}
