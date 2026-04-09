"use client";

import { ROLE_KEY, TOKEN_KEY } from "@/lib/constants";

function isBrowser() {
  return typeof window !== "undefined";
}

function setCookie(name: string, value: string) {
  if (!isBrowser()) return;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
}

function clearCookie(name: string) {
  if (!isBrowser()) return;
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
}

export function setAuthStorage(token: string, role: string) {
  if (!isBrowser()) return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(ROLE_KEY, role);
  setCookie(TOKEN_KEY, token);
  setCookie(ROLE_KEY, role);
}

export function clearAuthStorage() {
  if (!isBrowser()) return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
  clearCookie(TOKEN_KEY);
  clearCookie(ROLE_KEY);
}

export function getStoredToken() {
  if (!isBrowser()) return "";
  return localStorage.getItem(TOKEN_KEY) ?? "";
}
