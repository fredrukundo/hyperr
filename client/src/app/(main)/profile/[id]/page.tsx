"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, Film, Settings } from "lucide-react";
import { usePublicUser } from "@/hooks/useUser";
import { useAuthStore } from "@/store/auth.store";
import Avatar from "@/components/common/Avatar";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";

interface ProfilePageProps {
  params: Promise<{ id: string }>;
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const { id } = use(params);
  const { user: currentUser } = useAuthStore();
  const { data: profile, isLoading, isError, refetch } = usePublicUser(id);

  const isOwnProfile = currentUser?.id === id || currentUser?.id === parseInt(id);

  // ── Loading ──────────────────────────────────────────────────────────
  if (isLoading) {
    return <LoadingSpinner fullScreen text="Loading profile..." />;
  }

  // ── Error ────────────────────────────────────────────────────────────
  if (isError || !profile) {
    return (
      <ErrorMessage
        message="User not found or failed to load."
        onRetry={() => refetch()}
      />
    );
  }

  // Backend returns: first_name, last_name, profile_picture
  const firstName = profile.first_name || "";
  const lastName = profile.last_name || "";
  const initials = `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase();

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* ── Back button ── */}
      <Link
        href="/library"
        className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-[#2872A1] transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Library
      </Link>

      {/* ── Profile Card ── */}
      <div className="bg-card border-2 border-border rounded-3xl overflow-hidden">

        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-[#2872A1] to-[#4A90B8] relative">
          <div className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
              backgroundSize: "30px 30px",
            }}
          />
        </div>

        <div className="px-6 pb-6">
          {/* Avatar overlapping banner */}
          <div className="flex items-end justify-between -mt-12 mb-4">
            <div className="ring-4 ring-card rounded-full z-40">
              <Avatar
                src={profile.profile_picture}
                alt={profile.username}
                initials={initials}
                size="lg"
                className="!w-24 !h-24 !text-2xl !border-4"
              />
            </div>

            {/* Edit button if own profile */}
            {isOwnProfile && (
              <Link
                href="/settings"
                className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-[#2872A1] text-[#2872A1] text-sm font-bold hover:bg-[#2872A1] hover:text-white transition-all duration-200"
              >
                <Settings size={15} />
                Edit Profile
              </Link>
            )}
          </div>

          {/* Name & username */}
          <div className="space-y-1 mb-6">
            <h1 className="text-2xl font-black text-foreground">
              {firstName} {lastName}
            </h1>
            <p className="text-muted-foreground font-medium">
              @{profile.username}
            </p>
            
            {/* Show email only on own profile */}
            {isOwnProfile && profile.email && (
              <p className="text-sm text-muted-foreground">
                {profile.email}
              </p>
            )}
            
            {/* Show language preference on own profile */}
            {isOwnProfile && profile.preferred_language && (
              <p className="text-xs text-muted-foreground mt-2">
                Language: {profile.preferred_language === "en" ? "English" : profile.preferred_language === "fr" ? "Français" : profile.preferred_language}
              </p>
            )}
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-secondary/50 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-[#CBDDE9] dark:bg-[#2872A1]/20 rounded-xl flex items-center justify-center">
                <Film size={18} className="text-[#2872A1]" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">
                  Profile
                </p>
                <p className="text-sm font-bold text-foreground">
                  {isOwnProfile ? "Your account" : "Public profile"}
                </p>
              </div>
            </div>

            <div className="bg-secondary/50 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-[#CBDDE9] dark:bg-[#2872A1]/20 rounded-xl flex items-center justify-center">
                <Calendar size={18} className="text-[#2872A1]" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">
                  Member since
                </p>
                <p className="text-sm font-bold text-foreground">
                  {new Date().getFullYear()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Own profile note ── */}
      {isOwnProfile && (
        <div className="bg-[#CBDDE9]/30 dark:bg-[#2872A1]/10 border-2 border-[#2872A1]/20 rounded-2xl p-4 flex items-center gap-3">
          <span className="text-2xl">👋</span>
          <div>
            <p className="text-sm font-bold text-foreground">
              This is your public profile
            </p>
            <p className="text-xs text-muted-foreground">
              Other users can see your name, username and profile picture.
              Your email address is always private.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}