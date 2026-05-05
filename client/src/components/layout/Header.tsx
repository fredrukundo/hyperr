"use client";

import { use, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Film,
  Settings,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import ThemeToggle from "@/components/common/ThemeToggle";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import Avatar from "@/components/common/Avatar";
import { useCurrentUser } from "@/hooks/useUser";

// ── Nav links ──────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { href: "/library", label: "Library", icon: Film },
];

export default function Header() {
  const pathname = usePathname();
  const { logout } = useAuthStore();
  const {data:user } = useCurrentUser()
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    setUserMenuOpen(false);
    logout();
  };


  // ── Avatar: show picture or initials ──────────────────────────────────
  // const Avatar = ({ size = "sm" }: { size?: "sm" | "md" }) => {
  //   const sizeClass = size === "sm" ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm";
  //   const initials = user
  //     ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
  //     : "?";

  //   // ── Only render img if profilePicture is a non-empty string ──────────
  //   if (user?.profilePicture && user.profilePicture.trim() !== "") {
  //     return (
  //       <img
  //         src={user.profilePicture}
  //         alt={user.username}
  //         className={`${sizeClass} rounded-full object-cover border-2 border-[#CBDDE9]`}
  //       />
  //     );
  //   }

  //   return (
  //     <div
  //       className={`${sizeClass} rounded-full bg-[#2872A1] text-white font-bold flex items-center justify-center border-2 border-[#CBDDE9]`}
  //     >
  //       {initials}
  //     </div>
  //   );
  // };

  return (
    <header className="sticky top-0 z-50 bg-card border-b-2 border-border backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ── */}
          <Link
            href="/library"
            className="flex items-center gap-2.5 group"
          >
            <span className="text-2xl">🎬</span>
            <span className="text-xl font-black text-foreground group-hover:text-[#2872A1] transition-colors">
              Hypertube
            </span>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => {
              const isActive = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive
                    ? "bg-[#2872A1] text-white"
                    : "text-foreground hover:bg-secondary hover:text-[#2872A1]"
                    }`}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* ── Desktop Right Controls ── */}
          <div className="hidden md:flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border-2 border-border hover:border-[#2872A1] transition-all duration-200 bg-card"
              >
                <Avatar
                  src={user?.profile_picture}
                  alt={user?.username ?? "User"}
                  initials={`${user?.first_name?.[0] ?? ""}${user?.last_name?.[0] ?? ""}`}
                  size="sm"
                />

                <span className="text-sm font-semibold text-foreground max-w-[100px] truncate">
                  {user?.username ?? "User"}
                </span>
                <ChevronDown
                  size={14}
                  className={`text-muted-foreground transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              {/* Dropdown */}
              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 z-20 bg-card border-2 border-border rounded-xl shadow-xl overflow-hidden w-52">

                    {/* User info */}
                    <div className="px-4 py-3 border-b border-border bg-secondary/30">
                      <p className="text-sm font-bold text-foreground truncate">
                        {user?.first_name} {user?.last_name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        @{user?.username}
                      </p>
                    </div>

                    {/* Menu items */}
                    <div className="py-1">
                      <Link
                        href={`/profile/${user?.id}`}
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors"
                      >
                        <User size={16} className="text-[#2872A1]" />
                        My Profile
                      </Link>
                      <Link
                        href="/settings"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors"
                      >
                        <Settings size={16} className="text-[#2872A1]" />
                        Settings
                      </Link>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-border py-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ── Mobile: Hamburger ── */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-9 h-9 flex items-center justify-center rounded-xl border-2 border-border text-foreground hover:border-[#2872A1] hover:text-[#2872A1] transition-all duration-200"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t-2 border-border bg-card">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">

            {/* User info */}
            <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-xl mb-4">
              <Avatar
                src={user?.profile_picture}
                alt={user?.username ?? "User"}
                initials={`${user?.first_name?.[0] ?? ""}${user?.last_name?.[0] ?? ""}`}
                size="md"
              />
              <div>
                <p className="text-sm font-bold text-foreground">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-xs text-muted-foreground">
                  @{user?.username}
                </p>
              </div>
            </div>

            {/* Nav links */}
            {NAV_LINKS.map(({ href, label, icon: Icon }) => {
              const isActive = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${isActive
                    ? "bg-[#2872A1] text-white"
                    : "text-foreground hover:bg-secondary"
                    }`}
                >
                  <Icon size={18} />
                  {label}
                </Link>
              );
            })}

            {/* Profile & Settings */}
            <Link
              href={`/profile/${user?.id}`}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-foreground hover:bg-secondary transition-all"
            >
              <User size={18} className="text-[#2872A1]" />
              My Profile
            </Link>
            <Link
              href="/settings"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-foreground hover:bg-secondary transition-all"
            >
              <Settings size={18} className="text-[#2872A1]" />
              Settings
            </Link>

            {/* Language switcher */}
            <div className="px-4 py-2">
              <LanguageSwitcher />
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-destructive hover:bg-destructive/10 transition-all"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
}