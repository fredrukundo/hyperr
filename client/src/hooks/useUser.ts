"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserProfile, updateUserProfile, getAllUsers } from "@/services/user.service";
import { User, UpdateUserData } from "@/types/user.types";
import { useAuthStore } from "@/store/auth.store";

// ── Get Public User Profile ────────────────────────────────────────────────
export function usePublicUser(userId: string | number) {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUserProfile(userId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}

// ── Get Current User (Own Profile) ─────────────────────────────────────────
export function useCurrentUser() {
  const { user } = useAuthStore();
  
  return useQuery({
    queryKey: ["user", "me", user?.id],
    queryFn: () => {
      if (!user?.id) throw new Error("Not authenticated");
      return getUserProfile(user.id);
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
  });
}

// ── Update User Profile ────────────────────────────────────────────────────
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: (data: UpdateUserData) => {
      if (!user?.id) throw new Error("Not authenticated");
      return updateUserProfile(user.id, data);
    },
    onSuccess: () => {
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: ["user", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["user", "me"] });
    },
  });
}

// ── Get All Users (for search/mentions) ────────────────────────────────────
export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}