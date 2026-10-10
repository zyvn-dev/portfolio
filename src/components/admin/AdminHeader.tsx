"use client";

import React from "react";
import { AtmosphereBadge } from "../sky/AtmosphereBadge";
import { Shield } from "lucide-react";

export const AdminHeader: React.FC<{ title: string; subtitle?: string }> = ({
  title,
  subtitle,
}) => {
  return (
    <header className="border-b border-white/10 glass-panel bg-slate-950/40 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs font-mono text-white/50 mt-1">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <AtmosphereBadge />

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full glass-pill border border-white/10 text-xs font-mono text-white/70">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span>Admin</span>
        </div>
      </div>
    </header>
  );
};
