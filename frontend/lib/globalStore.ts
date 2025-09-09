"use client";

import { create } from "zustand";
import type { AuthStatus } from "@/lib/api";

// Simple global key-value store for in-memory objects + auth slice
export type GlobalState = {
  // generic KV
  objects: Record<string, unknown>;
  setObject: <T = unknown>(key: string, value: T) => void;
  getObject: <T = unknown>(key: string) => T | undefined;
  removeObject: (key: string) => void;
  clear: () => void;

  // auth slice
  auth: {
    authenticated: boolean | null; // null = unknown/loading
    username: string | null;
    roles: string[];
    loading: boolean;
    error: string | null;
  };
  setAuth: (auth: Partial<AuthStatus> & { authenticated: boolean }) => void;
  clearAuth: () => void;
  setAuthLoading: (loading: boolean) => void;
  setAuthError: (msg: string | null) => void;
};

export const useGlobalStore = create<GlobalState>((set, get) => ({
  // KV
  objects: {},
  setObject: (key, value) =>
    set((state) => ({ objects: { ...state.objects, [key]: value } })),
  getObject: (key) => get().objects[key] as any,
  removeObject: (key) =>
    set((state) => {
      const { [key]: _removed, ...rest } = state.objects;
      return { objects: rest };
    }),
  clear: () => set({ objects: {} }),

  // auth
  auth: {
    authenticated: null,
    username: null,
    roles: [],
    loading: false,
    error: null,
  },
  setAuth: (auth) =>
    set((state) => ({
      auth: {
        ...state.auth,
        authenticated: auth.authenticated,
        username: auth.username ?? null,
        roles: auth.roles ?? [],
        loading: false,
        error: null,
      },
    })),
  clearAuth: () => set({ auth: { authenticated: false, username: null, roles: [], loading: false, error: null } }),
  setAuthLoading: (loading) => set((state) => ({ auth: { ...state.auth, loading } })),
  setAuthError: (msg) => set((state) => ({ auth: { ...state.auth, error: msg, loading: false } })),
}));

// Convenience selectors
export function useObject<T = unknown>(key: string): T | undefined {
  return useGlobalStore((s) => s.objects[key] as T | undefined);
}

export const useSetObject = () => useGlobalStore((s) => s.setObject);
export const useRemoveObject = () => useGlobalStore((s) => s.removeObject);

export const useAuth = () => useGlobalStore((s) => s.auth);
export const useAuthUsername = () => useGlobalStore((s) => s.auth.username);
export const useAuthRoles = () => useGlobalStore((s) => s.auth.roles);