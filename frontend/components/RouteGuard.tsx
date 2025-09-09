"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/globalStore";

const PUBLIC_PATHS = new Set(["/", "/login", "/signup"]);
const PUBLIC_PREFIX = ["/test"];
const isPublicPath = (p: string) => PUBLIC_PATHS.has(p)
                    || PUBLIC_PREFIX.some((pref) => p === pref || p.startsWith(pref + "/"));

export default function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { authenticated, loading } = useAuth();

  useEffect(() => {
    if (loading) return; // wait until auth known

    if (!isPublicPath(pathname) && authenticated === false) {
      router.replace("/login");
    }
  }, [authenticated, loading, pathname, router]);

  // While checking auth on protected paths, avoid flashing content
  if (!isPublicPath(pathname) && (loading || authenticated === null)) {
    return null; // or a spinner
  }

  return <>{children}</>;
}