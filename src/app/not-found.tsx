"use client";

import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 text-center">
      <GlassCard className="max-w-md w-full p-8 space-y-6" tilt={false}>
        <div className="w-16 h-16 rounded-full glass-pill mx-auto flex items-center justify-center text-[var(--sky-primary)]">
          <Compass className="w-8 h-8 animate-spin-slow" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono text-white/40">ERROR 404</span>
          <h2 className="text-3xl font-display font-bold text-white">
            Lost in the Celestial Void
          </h2>
          <p className="text-sm text-white/60">
            The coordinates you requested do not exist in this sector of the sky.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium text-xs font-mono border border-white/15 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Orbit</span>
        </Link>
      </GlassCard>
    </div>
  );
}
