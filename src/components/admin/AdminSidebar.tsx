"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  GraduationCap,
  Award,
  FolderGit2,
  Mail,
  Settings,
  ArrowUpRight,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Profile", href: "/admin/profile", icon: User },
  { label: "Education", href: "/admin/education", icon: GraduationCap },
  { label: "Certifications", href: "/admin/certifications", icon: Award },
  { label: "Projects", href: "/admin/projects", icon: FolderGit2 },
  { label: "Messages Inbox", href: "/admin/messages", icon: Mail },
  { label: "Site Settings", href: "/admin/settings", icon: Settings },
];

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();

  const handleSignOut = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/";
  };

  return (
    <aside className="w-64 border-r border-white/10 glass-panel bg-slate-950/80 flex flex-col shrink-0 min-h-screen">
      {/* Brand header */}
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl glass-pill flex items-center justify-center text-[var(--sky-primary)] border border-white/10">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white tracking-tight">
              SKY CONSOLE
            </h2>
            <span className="text-[10px] font-mono text-[var(--sky-primary)] block">
              PRIVATE ADMIN
            </span>
          </div>
        </div>
      </div>

      {/* Navigation items */}
      <nav className="p-4 flex-1 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-all duration-150",
                isActive
                  ? "bg-white/15 text-white shadow-sm border border-white/10 font-semibold"
                  : "text-white/60 hover:text-white hover:bg-white/[0.06]"
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4",
                  isActive ? "text-[var(--sky-primary)]" : "text-white/40"
                )}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-mono text-white/60 hover:text-white hover:bg-white/5 transition-colors"
        >
          <span>View Public Site</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-white/30" />
        </Link>

        <button
          type="button"
          onClick={handleSignOut}
          className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-mono text-rose-300 hover:bg-rose-500/10 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
