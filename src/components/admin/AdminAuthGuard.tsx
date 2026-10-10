"use client";

import React, { useEffect, useState } from "react";
import { onAuthStateChanged, signInWithPopup, signOut, User } from "firebase/auth";
import { auth, googleProvider, ADMIN_EMAIL, isAuthorizedAdmin } from "@/lib/firebase/client";
import { GlassCard } from "../ui/GlassCard";
import { AccessDeniedCard } from "./AccessDeniedCard";
import { ShieldCheck, Lock, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const AdminAuthGuard: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [deniedEmail, setDeniedEmail] = useState<string | null>(null);
  const [signingIn, setSigningIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Enforce strict check
        const isAuth = isAuthorizedAdmin(currentUser.email, currentUser.emailVerified);

        if (!isAuth) {
          const rejected = currentUser.email;
          setDeniedEmail(rejected);
          await signOut(auth);
          setUser(null);
        } else {
          setUser(currentUser);
          setDeniedEmail(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    setSigningIn(true);
    setAuthError(null);
    setDeniedEmail(null);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const isAuth = isAuthorizedAdmin(result.user.email, result.user.emailVerified);

      if (!isAuth) {
        setDeniedEmail(result.user.email);
        await signOut(auth);
        setUser(null);
      } else {
        setUser(result.user);
      }
    } catch (err: any) {
      console.error("Sign-in failure:", err);
      if (err.code !== "auth/popup-closed-by-user") {
        setAuthError(err.message || "Authentication attempt was interrupted.");
      }
    } finally {
      setSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setUser(null);
    setDeniedEmail(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#07090e]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[var(--sky-primary)] animate-spin" />
          <span className="text-xs font-mono text-white/50">
            Verifying Identity & Security Tokens...
          </span>
        </div>
      </div>
    );
  }

  // Unauthorized state
  if (deniedEmail) {
    return <AccessDeniedCard email={deniedEmail} onSignOut={handleSignOut} />;
  }

  // Not signed in
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#07090e]">
        <GlassCard className="max-w-md w-full p-8 text-center space-y-6" tilt={false}>
          <div className="w-16 h-16 rounded-full glass-pill mx-auto flex items-center justify-center text-[var(--sky-primary)] border border-white/10">
            <Lock className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[var(--sky-primary)] font-semibold">
              PRIVATE CONSOLE
            </span>
            <h2 className="text-2xl font-display font-bold text-white">
              Administrator Access
            </h2>
            <p className="text-sm text-white/60 leading-relaxed">
              Authenticate via verified Google account. Access is restricted exclusively to the portfolio owner.
            </p>
          </div>

          {authError && (
            <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-mono">
              {authError}
            </div>
          )}

          <div className="space-y-3 pt-2">
            <button
              type="button"
              disabled={signingIn}
              onClick={handleGoogleSignIn}
              className="w-full py-3.5 px-6 rounded-full bg-white text-slate-950 font-semibold text-sm hover:bg-white/90 active:scale-[0.98] transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
            >
              {signingIn ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Connecting with Google...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </>
              )}
            </button>

            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-mono text-white/50 hover:text-white pt-2 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public Portfolio</span>
            </Link>
          </div>
        </GlassCard>
      </div>
    );
  }

  // Authenticated and strictly authorized
  return <>{children}</>;
};
