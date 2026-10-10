"use client";

import React, { useEffect, useState, useCallback } from "react";
import { GlassCard } from "../ui/GlassCard";
import { Lock, Loader2, ArrowLeft, Eye, EyeOff, ShieldCheck } from "lucide-react";
import Link from "next/link";

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

export const AdminAuthGuard: React.FC<AdminAuthGuardProps> = ({ children }) => {
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verify = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/verify");
      setStatus(res.ok ? "authenticated" : "unauthenticated");
    } catch {
      setStatus("unauthenticated");
    }
  }, []);

  useEffect(() => {
    verify();
  }, [verify]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSigningIn(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      if (res.ok) {
        setStatus("authenticated");
      } else {
        const data = await res.json();
        setError(data.message || "Invalid credentials. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSigningIn(false);
    }
  };

  // ── Loading ──────────────────────────────────────────────────────────────
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#07090e]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[var(--sky-primary)] animate-spin" />
          <span className="text-xs font-mono text-white/50">Verifying session…</span>
        </div>
      </div>
    );
  }

  // ── Login form ───────────────────────────────────────────────────────────
  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#07090e]">
        {/* subtle grid bg */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <GlassCard className="max-w-md w-full p-8 space-y-6 relative z-10" tilt={false}>
          {/* Icon */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full glass-pill mx-auto flex items-center justify-center text-[var(--sky-primary)] border border-white/10">
              <Lock className="w-7 h-7" />
            </div>
            <div className="text-center space-y-1">
              <span className="text-xs font-mono uppercase tracking-widest text-[var(--sky-primary)] font-semibold">
                PRIVATE CONSOLE
              </span>
              <h2 className="text-2xl font-display font-bold text-white">Administrator Access</h2>
              <p className="text-sm text-white/50">Restricted to portfolio owner only.</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-mono text-white/50 uppercase tracking-wider">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="username"
                className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[var(--sky-primary)] transition-colors"
                placeholder="admin@example.com"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-white/50 uppercase tracking-wider">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full px-4 py-3 pr-12 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[var(--sky-primary)] transition-colors"
                  placeholder="••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-mono">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={signingIn}
              className="w-full py-3.5 px-6 rounded-full bg-[var(--sky-primary)] text-white font-semibold text-sm hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 mt-2"
            >
              {signingIn ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying…</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          <div className="flex justify-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-mono text-white/40 hover:text-white pt-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Public Portfolio
            </Link>
          </div>
        </GlassCard>
      </div>
    );
  }

  // ── Authenticated ────────────────────────────────────────────────────────
  return <>{children}</>;
};
