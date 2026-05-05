"use client";

import { Settings } from "lucide-react";
import ProfilePictureUpload from "@/components/profile/ProfilePictureUpload";
import EditProfileForm from "@/components/profile/EditProfileForm";
import ChangePasswordForm from "@/components/profile/ChangePasswordForm";
import LanguageSettings from "@/components/profile/LanguageSettings";
import { useCurrentUser } from "@/hooks/useUser";
import LoadingSpinner from "@/components/common/LoadingSpinner";

export default function SettingsPage() {
  const { isLoading } = useCurrentUser(); // ← Fixed: changed from isSyncing to isLoading

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Loading settings..." />;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* ── Page header ── */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#CBDDE9] dark:bg-[#2872A1]/20 rounded-xl flex items-center justify-center">
          <Settings size={20} className="text-[#2872A1]" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-foreground">Settings</h1>
          <p className="text-muted-foreground text-sm">
            Manage your account preferences
          </p>
        </div>
      </div>

      {/* ── Profile Picture ── */}
      <ProfilePictureUpload />

      {/* ── Personal Info ── */}
      <EditProfileForm />

      {/* ── Password ── */}
      <ChangePasswordForm />

      {/* ── Language ── */}
      <LanguageSettings />

      {/* ── Danger Zone ── */}
      <div className="bg-card border-2 border-destructive/30 rounded-2xl p-6">
        <h2 className="text-lg font-black text-destructive mb-2">
          Danger Zone
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button
          onClick={() =>
            window.confirm(
              "Are you sure you want to delete your account? This cannot be undone."
            )
          }
          className="flex items-center gap-2 bg-destructive/10 hover:bg-destructive text-destructive hover:text-white border-2 border-destructive/30 hover:border-destructive font-bold px-5 py-2.5 rounded-xl transition-all duration-200 text-sm"
        >
          Delete Account
        </button>
      </div>

    </div>
  );
}