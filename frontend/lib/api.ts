// Centralized API utilities for client-side usage
// Now sending JSON payloads

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body ?? {}),
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Request failed (${res.status}): ${text || res.statusText}`);
  }

  return (await res.json()) as T;
}

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Request failed (${res.status}): ${text || res.statusText}`);
  }
  return (await res.json()) as T;
}

export type AuthStatus = { authenticated: boolean; username: string | null; roles: string[] };
export async function getAuthStatus(): Promise<AuthStatus> {
  return getJson<AuthStatus>("/spring-boot/api/users/me");
}

export type LoginResponse = { success: string };
export async function login(fields: { username: string; password: string; rememberMe?: boolean }): Promise<LoginResponse> {
  const { username, password, rememberMe = false } = fields;
  return postJson<LoginResponse>("/api/auth/login", { username, password, rememberMe });
}

export type RegisterResponse = { username: string, role: string };
export async function register(fields: {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  isCreator: boolean;
  termsAccepted: boolean;
  role: string;
}): Promise<RegisterResponse> {
  const { username, email, password, confirmPassword, phoneNumber, isCreator, termsAccepted, role } = fields;
  return postJson<RegisterResponse>("/api/auth/register", {
    username,
    email,
    password,
    confirmPassword,
    phoneNumber,
    isCreator,
    termsAccepted,
    role,
  });
}