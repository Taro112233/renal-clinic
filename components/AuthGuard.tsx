// components/AuthGuard.tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useEffect } from "react";
import { hasAdminAccess, isSuperAdmin } from "@/lib/auth-helpers";

const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/register",
  "/terms-of-service",
  "/privacy-policy",
];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useCurrentUser();

  useEffect(() => {
    if (loading) return;

    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
    
    // Redirect to login if not authenticated and trying to access protected route
    if (!user && !isPublicRoute) {
      router.push("/login");
      return;
    }

    // Super Admin route check - only SUPERADMIN can access
    if (pathname.startsWith("/superadmin")) {
      if (!user) {
        router.push("/login");
        return;
      }
      if (!isSuperAdmin(user.role)) {
        console.warn(`Access denied: User ${user.id} (${user.role}) attempted to access /superadmin`);
        router.push("/dashboard");
        return;
      }
    }

    // Admin route check - ADMIN and SUPERADMIN can access
    if (pathname.startsWith("/admin")) {
      if (!user) {
        router.push("/login");
        return;
      }
      if (!hasAdminAccess(user.role)) {
        console.warn(`Access denied: User ${user.id} (${user.role}) attempted to access /admin`);
        router.push("/dashboard");
        return;
      }
    }
  }, [user, loading, pathname, router]);

  return <>{children}</>;
}