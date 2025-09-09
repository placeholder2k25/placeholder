"use client";

import { useEffect } from "react";
import { getAuthStatus } from "@/lib/api";
import { useGlobalStore } from "@/lib/globalStore";

// Fetches auth once on mount and stores it in Zustand (client-only)
export default function AuthBootstrap() {
  const setAuth = useGlobalStore((s) => s.setAuth);
  const setAuthLoading = useGlobalStore((s) => s.setAuthLoading);
  const setAuthError = useGlobalStore((s) => s.setAuthError);

  useEffect(() => {
    let active = true;
    (async () => {
      setAuthLoading(true);
      try {
        const data = await getAuthStatus();
        if (!active) return;
        setAuth({ authenticated: !!data.authenticated, username: data.username ?? null, roles: data.roles ?? [] });
      } catch (e: any) {
        if (!active) return;
        setAuthError(e?.message ?? "Failed to load auth status");
        setAuth({ authenticated: false, username: null, roles: [] });
      } finally {
        if (active) setAuthLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [setAuth, setAuthLoading, setAuthError]);

  return null; // no UI
}