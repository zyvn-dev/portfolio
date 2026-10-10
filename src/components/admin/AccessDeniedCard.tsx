"use client";

import React from "react";
import { GlassCard } from "../ui/GlassCard";
import { ShieldAlert, ArrowLeft, LogOut } from "lucide-react";
import Link from "next/link";

interface AccessDeniedCardProps {
  email?: string | null;
  onSignOut: () => void;
}

export const AccessDeniedCard: React.FC<AccessDeniedCardProps> = ({
  email,
  onSignOut,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#07090e]">
      <GlassCard className="max-w-md w-full p-8 text-center space-y-6 border-rose-500/20" tilt={false}>
        <div className="w-16 h-16 rounded-full glass-pill mx-auto flex items-center justify-center text-rose-400 border border-rose-500/30">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-rose-400 font-bold">
            SECURITY GUARD // ACCESS DENIED
          </span>
          <h2 className="text-2xl font-display font-bold text-white">
            Unauthorized Identity
          </h2>
          <p className="text-sm text-white/60 leading-relaxed">
            The administrative console is strictly restricted to the verified owner.
            {email && (
              <span className="block mt-2 font-mono text-xs text-white/40 bg-white/5 py-1 px-2 rounded-lg">
                Signed in as: {email}
              </span>
            )}
          </p>
        </div>

        <div className="pt-2 flex flex-col gap-3">
          <button
            type="button"
            onClick={onSignOut}
            className="w-full py-2.5 px-4 rounded-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-mono text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out & Revoke Session</span>
          </button>

          <Link
            href="/"
            className="w-full py-2.5 px-4 rounded-full glass-pill hover:bg-white/10 text-white/70 hover:text-white font-mono text-xs flex items-center justify-center gap-2 transition-colors border border-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Public Site</span>
          </Link>
        </div>
      </GlassCard>
    </div>
  );
};
