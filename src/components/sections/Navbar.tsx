"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AtmosphereBadge } from "../sky/AtmosphereBadge";
import { Menu, X, ArrowUpRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Education", href: "#education" },
  { label: "Certifications", href: "#certifications" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export const Navbar: React.FC = () => {
  const [activeSection, setActiveSection] = useState("hero");
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      const sections = NAV_LINKS.map((link) => link.href.substring(1));
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 flex justify-center p-4 sm:p-6 pointer-events-none">
        <motion.nav
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "pointer-events-auto flex items-center justify-between gap-3 sm:gap-6 px-4 sm:px-6 py-2.5 rounded-full transition-all duration-300",
            isScrolled
              ? "glass-panel bg-slate-950/70 shadow-2xl border-white/15 scale-95"
              : "glass-pill bg-slate-950/40 border-white/10"
          )}
        >
          {/* Logo / Brand anchor */}
          <a
            href="#hero"
            className="flex items-center gap-2 text-white font-medium tracking-tight text-sm group"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-[var(--sky-primary)] shadow-sm shadow-[var(--sky-glow)] group-hover:scale-125 transition-transform" />
            <span className="hidden sm:inline font-semibold">PORTFOLIO</span>
          </a>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-1 relative bg-white/[0.03] p-1 rounded-full border border-white/5">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.href.substring(1);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors duration-200 z-10",
                    isActive ? "text-white" : "text-white/60 hover:text-white/90"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavPill"
                      className="absolute inset-0 rounded-full bg-white/15 border border-white/20 shadow-sm"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </a>
              );
            })}
          </div>

          {/* Right actions: Atmosphere Badge + Admin Link + Mobile Menu Trigger */}
          <div className="flex items-center gap-2">
            <AtmosphereBadge />

            <Link
              href="/admin"
              className="hidden lg:flex items-center gap-1 text-[11px] font-mono text-white/50 hover:text-white px-2.5 py-1.5 rounded-full glass-panel hover:border-white/20 transition-colors"
              title="Admin Panel"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[var(--sky-primary)]" />
              <span>Admin</span>
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </motion.nav>
      </header>

      {/* Full-screen animated mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(24px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="fixed inset-0 z-50 bg-slate-950/85 flex flex-col p-6 md:hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-white/40 font-mono">
                Navigation
              </span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-full glass-pill text-white/80 hover:text-white"
                aria-label="Close navigation menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 flex flex-col justify-center space-y-6">
              {NAV_LINKS.map((link, idx) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 * idx }}
                  className="text-3xl font-display font-semibold text-white/80 hover:text-white flex items-center justify-between group"
                >
                  <span>{link.label}</span>
                  <ArrowUpRight className="w-5 h-5 text-white/30 group-hover:text-[var(--sky-primary)] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                </motion.a>
              ))}
            </div>

            <div className="pt-6 border-t border-white/10 flex items-center justify-between">
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-xs font-mono text-white/60 hover:text-white"
              >
                <ShieldCheck className="w-4 h-4 text-[var(--sky-primary)]" />
                <span>Admin Login</span>
              </Link>
              <span className="text-xs text-white/30 font-mono">The Living Sky</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
