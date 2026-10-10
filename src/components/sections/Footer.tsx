"use client";

import React from "react";
import { ArrowUp, Heart, Shield } from "lucide-react";
import Link from "next/link";
import { useTimeAtmosphere } from "../sky/TimeAtmosphereContext";
import { ProfileData } from "@/lib/types";

export const Footer: React.FC<{ profile: ProfileData | null }> = ({ profile }) => {
  const { atmosphere } = useTimeAtmosphere();
  const year = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative py-12 px-4 sm:px-6 border-t border-white/10 mt-20 z-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-mono text-white/50">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[var(--sky-primary)] animate-pulse" />
          <span>
            {profile?.fullName || "Portfolio Template"} © {year}
          </span>
          <span className="text-white/20">•</span>
          <span className="text-white/40">The Living Sky Engine</span>
        </div>

        <div className="flex items-center gap-6">
          <span className="hidden sm:inline text-white/40">
            Local Cycle: <span className="text-white/80">{atmosphere.label}</span>
          </span>

          <Link
            href="/admin"
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Shield className="w-3.5 h-3.5 text-[var(--sky-primary)]" />
            <span>Admin</span>
          </Link>

          <button
            type="button"
            onClick={scrollToTop}
            className="p-2 rounded-full glass-pill hover:bg-white/10 text-white/70 hover:text-white transition-all active:scale-90"
            aria-label="Scroll back to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};
