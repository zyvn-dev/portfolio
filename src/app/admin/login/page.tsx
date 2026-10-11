"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  Lock,
  Loader2,
  ArrowLeft,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  KeyRound,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/Toast";

export default function AdminLoginPage() {
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password.trim()) {
      const msg = "Please enter both email and password";
      setErrorMessage(msg);
      showToast(msg, "error");
      return;
    }

    setSigningIn(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const errorText = data.message || "Invalid credentials";
        setErrorMessage(errorText);
        showToast(errorText, "error");
        return;
      }

      showToast("Access granted. Initializing dashboard...", "success");

      // Full document reload to ensure the new httpOnly admin_session cookie
      // is immediately processed by Next.js Edge middleware
      window.location.href = "/admin/dashboard";
    } catch {
      const netError = "Network error. Please try again.";
      setErrorMessage(netError);
      showToast(netError, "error");
    } finally {
      setSigningIn(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-[#050812] relative overflow-hidden">
      {/* Subtle CS Circuit Grid Background Effect */}
      <div
        className="fixed inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 212, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 212, 255, 0.05) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Cyber Glow Accent */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(0,212,255,0.08)_0%,transparent_70%)] pointer-events-none blur-3xl" />

      <GlassCard
        className="max-w-md w-full p-8 sm:p-10 space-y-6 relative z-10 border border-white/10 shadow-2xl bg-slate-950/70"
        tilt={false}
      >
        {/* Terminal Header */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-16 h-16 rounded-2xl glass-pill mx-auto flex items-center justify-center text-[var(--sky-primary)] border border-cyan-500/20 shadow-lg shadow-cyan-500/10">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[var(--sky-secondary)] font-semibold flex items-center justify-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--sky-secondary)] animate-ping" />
              AUTHENTICATED ACCESS ONLY
            </span>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
              Admin Console
            </h1>
            <p className="text-xs text-white/50 font-mono">
              Authenticate with your root portfolio credentials.
            </p>
          </div>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs flex items-center gap-2.5 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-white/60 uppercase tracking-wider flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[var(--sky-primary)]" />
              <span>Admin Email</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
              placeholder="muhammmadzainumer@gmail.com"
              className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[var(--sky-primary)] focus:ring-1 focus:ring-[var(--sky-primary)] transition-all font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-white/60 uppercase tracking-wider flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-[var(--sky-secondary)]" />
              <span>Password</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••••••"
                className="w-full px-4 py-3 pr-12 rounded-2xl bg-white/[0.04] border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[var(--sky-primary)] focus:ring-1 focus:ring-[var(--sky-primary)] transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={signingIn}
            className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[var(--sky-secondary)] to-[var(--sky-primary)] text-slate-950 font-semibold text-sm shadow-lg shadow-[var(--sky-glow)] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {signingIn ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying credentials…</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Enter Admin Dashboard</span>
              </>
            )}
          </button>
        </form>

        {/* Back Link */}
        <div className="flex justify-center pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-white/40 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Public Portfolio</span>
          </Link>
        </div>
      </GlassCard>
    </div>
  );
}
