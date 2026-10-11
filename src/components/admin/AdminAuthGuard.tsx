"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Loader2 } from "lucide-react";

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

export const AdminAuthGuard: React.FC<AdminAuthGuardProps> = ({ children }) => {
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading");

  const verify = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/verify");
      if (res.ok) {
        setStatus("authenticated");
      } else {
        setStatus("unauthenticated");
        window.location.href = "/admin/login";
      }
    } catch {
      setStatus("unauthenticated");
      window.location.href = "/admin/login";
    }
  }, []);

  useEffect(() => {
    verify();
  }, [verify]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050812]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[var(--sky-primary)] animate-spin" />
          <span className="text-xs font-mono text-white/50">Verifying session…</span>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return <>{children}</>;
};
