"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "../ui/GlassCard";
import { Send, CheckCircle2, AlertCircle, Loader2, Sparkles, Mail } from "lucide-react";
import confetti from "canvas-confetti";
import { useToast } from "../ui/Toast";

interface ContactSectionProps {
  directEmail?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ directEmail }) => {
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    honeypot: "",
  });

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // Client-side validations
    if (formData.name.trim().length < 2) {
      setErrorMessage("Please enter a valid name (at least 2 characters).");
      return;
    }
    if (!formData.email.includes("@") || !formData.email.includes(".")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (formData.message.trim().length < 10) {
      setErrorMessage("Please enter a message of at least 10 characters.");
      return;
    }

    setStatus("submitting");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to send message");
      }

      setStatus("success");
      showToast("Message sent successfully!", "success");

      // Trigger celebratory confetti burst
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 },
        colors: ["#38bdf8", "#22d3ee", "#ff7e95", "#8b5cf6", "#14b8a6"],
      });

      // Clear form
      setFormData({ name: "", email: "", message: "", honeypot: "" });
    } catch (err: any) {
      setStatus("error");
      const msg = err.message || "Something went wrong. Please try again.";
      setErrorMessage(msg);
      showToast(msg, "error");
    }
  };

  return (
    <section id="contact" className="relative py-28 px-4 sm:px-6 max-w-4xl mx-auto">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-10">
        <span className="text-xs font-mono uppercase tracking-widest text-[var(--sky-secondary)]">
          05 // CONTACT & INQUIRIES
        </span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <div className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-5xl font-display font-semibold text-white tracking-tight"
          >
            Start a Conversation
          </motion.h3>
          <p className="text-white/60 text-sm sm:text-base leading-relaxed">
            Have an ambitious concept, collaboration opportunity, or role in mind? Drop a transmission below.
          </p>
        </div>

        <GlassCard className="p-8 sm:p-10 border border-white/10 max-w-2xl mx-auto relative" tilt={false}>
          {status === "success" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 flex flex-col items-center justify-center text-center space-y-4"
            >
              <div className="w-16 h-16 rounded-full glass-pill flex items-center justify-center text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-display font-semibold text-white">
                Transmission Received
              </h4>
              <p className="text-sm text-white/60 max-w-sm">
                Thank you for reaching out. Your message has been safely recorded in the inbox and will be answered promptly.
              </p>
              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="mt-4 px-6 py-2.5 rounded-full glass-pill hover:bg-white/15 text-xs font-mono text-white transition-all border border-white/10"
              >
                Send Another Message
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Banner */}
              {errorMessage && (
                <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Honeypot field (hidden from humans, trapped for bots) */}
              <input
                type="text"
                name="honeypot"
                value={formData.honeypot}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, honeypot: e.target.value }))
                }
                style={{ display: "none" }}
                tabIndex={-1}
                autoComplete="off"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-mono text-white/60 block">
                    NAME *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ada Lovelace"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[var(--sky-primary)] focus:ring-1 focus:ring-[var(--sky-primary)] transition-all font-sans"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono text-white/60 block">
                    EMAIL *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="ada@computing.org"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, email: e.target.value }))
                    }
                    className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[var(--sky-primary)] focus:ring-1 focus:ring-[var(--sky-primary)] transition-all font-sans"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-white/60 block">
                  MESSAGE *
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Tell me about your project, timeline, or thoughts..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, message: e.target.value }))
                  }
                  className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[var(--sky-primary)] focus:ring-1 focus:ring-[var(--sky-primary)] transition-all font-sans resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[var(--sky-secondary)] to-[var(--sky-primary)] text-slate-950 font-semibold text-sm shadow-lg shadow-[var(--sky-glow)] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === "submitting" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Transmitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Transmission</span>
                  </>
                )}
              </button>
            </form>
          )}
        </GlassCard>
      </div>
    </section>
  );
};
