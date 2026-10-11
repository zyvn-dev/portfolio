"use client";

import React, { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  FolderGit2,
  GraduationCap,
  Award,
  Mail,
  User,
  Settings,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import {
  getProjects,
  getEducation,
  getCertifications,
  getMessages,
  getProfile,
} from "@/lib/firebase/firestore-services";
import { useTimeAtmosphere } from "@/components/sky/TimeAtmosphereContext";

export default function AdminDashboardPage() {
  const { atmosphere } = useTimeAtmosphere();

  const [stats, setStats] = useState({
    projectsCount: 0,
    educationCount: 0,
    certCount: 0,
    unreadMessages: 0,
    totalMessages: 0,
    hasProfile: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [projects, edu, certs, messages, profile] = await Promise.all([
          getProjects(),
          getEducation(),
          getCertifications(),
          getMessages(),
          getProfile(),
        ]);

        const unread = messages.filter((m) => !m.read).length;

        setStats({
          projectsCount: projects.length,
          educationCount: edu.length,
          certCount: certs.length,
          unreadMessages: unread,
          totalMessages: messages.length,
          hasProfile: !!profile?.fullName,
        });
      } catch (err) {
        console.warn("Stats load warning:", err);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  const metricCards = [
    {
      label: "Profile Status",
      value: stats.hasProfile ? "Active" : "Not Set",
      href: "/admin/profile",
      icon: User,
      color: "text-[var(--sky-secondary)]",
    },
    {
      label: "Published Projects",
      value: stats.projectsCount,
      href: "/admin/projects",
      icon: FolderGit2,
      color: "text-[var(--sky-primary)]",
    },
    {
      label: "Education Items",
      value: stats.educationCount,
      href: "/admin/education",
      icon: GraduationCap,
      color: "text-[var(--sky-secondary)]",
    },
    {
      label: "Certifications",
      value: stats.certCount,
      href: "/admin/certifications",
      icon: Award,
      color: "text-[var(--sky-primary)]",
    },
    {
      label: "Unread Messages",
      value: stats.unreadMessages,
      href: "/admin/messages",
      icon: Mail,
      color: stats.unreadMessages > 0 ? "text-amber-400" : "text-white/60",
      badge: stats.unreadMessages > 0 ? `${stats.unreadMessages} New` : undefined,
    },
  ];

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Admin Control Center"
        subtitle="Manage your public living sky portfolio in real time"
      />

      <main className="p-6 sm:p-8 space-y-8 max-w-6xl w-full">
        {/* Welcome Greeting Banner */}
        <GlassCard className="p-8 relative overflow-hidden" tilt={false}>
          <div className="max-w-xl space-y-3 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill text-xs font-mono text-[var(--sky-secondary)] border border-white/10">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{atmosphere.greeting}, Administrator</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
              Portfolio Command Hub
            </h2>
            <p className="text-sm text-white/60 leading-relaxed">
              All collections update your public portfolio immediately upon saving. Use the modules below to maintain your bio, work, credentials, and settings.
            </p>
          </div>
        </GlassCard>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {metricCards.map((m) => {
            const Icon = m.icon;
            return (
              <Link key={m.label} href={m.href}>
                <GlassCard className="p-6 space-y-4 hover:border-white/20 transition-all group" tilt={false}>
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl glass-pill flex items-center justify-center border border-white/10">
                      <Icon className={`w-5 h-5 ${m.color}`} />
                    </div>
                    {m.badge && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                        {m.badge}
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="text-3xl font-display font-bold text-white">
                      {loading ? "…" : m.value}
                    </span>
                    <span className="text-xs font-mono text-white/50 block mt-1">
                      {m.label}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono text-white/40 group-hover:text-white pt-2 border-t border-white/5 transition-colors">
                    <span>Manage Module</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </GlassCard>
              </Link>
            );
          })}
        </div>

        {/* Quick Management Directives */}
        <GlassCard className="p-6 sm:p-8 space-y-4" tilt={false}>
          <h3 className="text-lg font-display font-semibold text-white">
            Quick Navigation &amp; Content Modules
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <Link
              href="/admin/profile"
              className="p-4 rounded-2xl glass-pill hover:bg-white/10 transition-colors border border-white/10 flex items-start gap-3"
            >
              <User className="w-5 h-5 text-[var(--sky-secondary)] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-white">1. Profile Details</h4>
                <p className="text-xs text-white/50 mt-1">
                  Configure full name, headline, bio paragraphs, social links &amp; portrait.
                </p>
              </div>
            </Link>

            <Link
              href="/admin/projects"
              className="p-4 rounded-2xl glass-pill hover:bg-white/10 transition-colors border border-white/10 flex items-start gap-3"
            >
              <FolderGit2 className="w-5 h-5 text-[var(--sky-primary)] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-white">2. Projects &amp; Bento Grid</h4>
                <p className="text-xs text-white/50 mt-1">
                  Upload cover images, write descriptions, and attach dynamic external links.
                </p>
              </div>
            </Link>

            <Link
              href="/admin/settings"
              className="p-4 rounded-2xl glass-pill hover:bg-white/10 transition-colors border border-white/10 flex items-start gap-3"
            >
              <Settings className="w-5 h-5 text-[var(--sky-secondary)] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-white">3. Visibility &amp; Settings</h4>
                <p className="text-xs text-white/50 mt-1">
                  Toggle section visibility on the live site, update SEO meta, and branding.
                </p>
              </div>
            </Link>
          </div>
        </GlassCard>
      </main>
    </div>
  );
}
