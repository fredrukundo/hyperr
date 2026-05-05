"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { getToken } from "@/services/auth.service";

interface UseAuthOptions {
  // If true → redirect to /login if not authenticated
  requireAuth?: boolean;
  // If true → redirect to /library if already authenticated
  requireGuest?: boolean;
  // Where to redirect if not authenticated
  redirectTo?: string;
}

export function useAuth(options: UseAuthOptions = {}) {
  const { requireAuth = false, requireGuest = false, redirectTo = "/login" } =
    options;

  const router = useRouter();
  const { user, isAuthenticated, logout, updateUser } = useAuthStore();

  useEffect(() => {
    const token = getToken();

    // No token in localStorage → force logout and redirect
    if (requireAuth && !token) {
      logout();
      router.replace(redirectTo);
      return;
    }

    // Has token but on a guest-only page → redirect to library
    if (requireGuest && token) {
      router.replace("/library");
      return;
    }
  }, [requireAuth, requireGuest, redirectTo, router, logout]);

  return {
    user,
    isAuthenticated,
    logout,
    updateUser,
    // Convenience: is loading if we expect auth but have no user yet
    isLoading: requireAuth && !user && !!getToken(),
  };
}