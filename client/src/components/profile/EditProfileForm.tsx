"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Save } from "lucide-react";
import { useCurrentUser, useUpdateProfile } from "@/hooks/useUser";
import { useToastStore } from "@/store/toast.store";
import { User } from "@/types/user.types";

interface EditProfileFormProps {
  user: User;
}
const editProfileSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .regex(
      /^[a-z][a-z.]*[a-z]$|^[a-z]{3,}$/,
      "Username must be lowercase, can contain dots (not at start/end or consecutive)"
    )
    .refine((val) => !val.includes(".."), "Username cannot have consecutive dots"),
  email: z.string().email("Invalid email format"),
  first_name: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name is too long"),
  last_name: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name is too long"),
});

type EditProfileData = z.infer<typeof editProfileSchema>;


export default function EditProfileForm({
  user,
}: EditProfileFormProps) {
  // const { data: user, refetch } = useCurrentUser();
  const updateProfile = useUpdateProfile();
  const { success, error, info } = useToastStore(); // ← Fixed

const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<EditProfileData>({
    resolver: zodResolver(editProfileSchema),
  });

  useEffect(() => {
    reset({
      username: user.username ?? "",
      email: user.email ?? "",
      first_name: user.first_name ?? "",
      last_name: user.last_name ?? "",
    });
  }, [user, reset]);

  const onSubmit = async (data: EditProfileData) => {
    try {
      const updates: Partial<EditProfileData> = {};

      if (data.username !== user.username) updates.username = data.username;
      if (data.email !== user.email) updates.email = data.email;
      if (data.first_name !== user.first_name)
        updates.first_name = data.first_name;
      if (data.last_name !== user.last_name)
        updates.last_name = data.last_name;

      if (Object.keys(updates).length === 0) {
        info("No changes to save");
        return;
      }

      await updateProfile.mutateAsync(updates);

      success("Profile updated successfully");
    } catch (err: any) {
      error(err.message || "Failed to update profile");
    }
  };

  return (
    <div className="bg-card border-2 border-border rounded-2xl p-6">
      <h2 className="text-lg font-black text-foreground mb-4">
        Personal Information
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Username */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-foreground block">
            Username
          </label>
          <input
            {...register("username")}
            type="text"
            className={`w-full px-4 py-2.5 rounded-xl border-2 bg-card text-foreground text-sm transition-all duration-200 outline-none focus:border-[#2872A1] focus:ring-2 focus:ring-[#2872A1]/20 ${
              errors.username
                ? "border-destructive focus:border-destructive focus:ring-destructive/20"
                : "border-border"
            }`}
          />
          {errors.username && (
            <p className="text-destructive text-xs flex items-center gap-1">
              <span>⚠</span> {errors.username.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-foreground block">
            Email
          </label>
          <input
            {...register("email")}
            type="email"
            className={`w-full px-4 py-2.5 rounded-xl border-2 bg-card text-foreground text-sm transition-all duration-200 outline-none focus:border-[#2872A1] focus:ring-2 focus:ring-[#2872A1]/20 ${
              errors.email
                ? "border-destructive focus:border-destructive focus:ring-destructive/20"
                : "border-border"
            }`}
          />
          {errors.email && (
            <p className="text-destructive text-xs flex items-center gap-1">
              <span>⚠</span> {errors.email.message}
            </p>
          )}
        </div>

        {/* First & Last Name */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground block">
              First Name
            </label>
            <input
              {...register("first_name")}
              type="text"
              className={`w-full px-4 py-2.5 rounded-xl border-2 bg-card text-foreground text-sm transition-all duration-200 outline-none focus:border-[#2872A1] focus:ring-2 focus:ring-[#2872A1]/20 ${
                errors.first_name
                  ? "border-destructive focus:border-destructive focus:ring-destructive/20"
                  : "border-border"
              }`}
            />
            {errors.first_name && (
              <p className="text-destructive text-xs flex items-center gap-1">
                <span>⚠</span> {errors.first_name.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground block">
              Last Name
            </label>
            <input
              {...register("last_name")}
              type="text"
              className={`w-full px-4 py-2.5 rounded-xl border-2 bg-card text-foreground text-sm transition-all duration-200 outline-none focus:border-[#2872A1] focus:ring-2 focus:ring-[#2872A1]/20 ${
                errors.last_name
                  ? "border-destructive focus:border-destructive focus:ring-destructive/20"
                  : "border-border"
              }`}
            />
            {errors.last_name && (
              <p className="text-destructive text-xs flex items-center gap-1">
                <span>⚠</span> {errors.last_name.message}
              </p>
            )}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!isDirty || isSubmitting}
          className="flex items-center gap-2 bg-[#2872A1] hover:bg-[#1A4A6B] text-white font-bold px-5 py-2.5 rounded-xl transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={16} />
              Save Changes
            </>
          )}
        </button>
      </form>
    </div>
  );
}