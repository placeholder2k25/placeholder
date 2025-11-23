"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/globalStore";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default function DashboardPage() {
  const router = useRouter();
  const { authenticated, roles, loading } = useAuth();

  // Detect "brand" role (supports values like "brand" or "ROLE_BRAND")
  const isBrand = Array.isArray(roles) && roles.some((r) => r?.toLowerCase?.().includes("brand"));

  useEffect(() => {
    if (loading) return;
    // Not authenticated → RouteGuard should already handle, but keep safe redirect
    if (authenticated === false) {
      router.replace("/login");
      return;
    }
    // Authenticated but not a brand → redirect away
    if (authenticated === true && !isBrand) {
      router.replace("/");
    }
  }, [authenticated, isBrand, loading, router]);

  // Avoid flashing while checking
  if (loading || authenticated === null) return null;

  // Only render for brand users
  if (authenticated && isBrand) {
    return <DashboardLayout />;
  }

  return null;
}
