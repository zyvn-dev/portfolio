"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import { GlassCard } from "../ui/GlassCard";
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import confetti from "canvas-confetti";
import {
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID,
  EMAILJS_PUBLIC_KEY,
} from "@/lib/emailjs";

export const ContactSection: React.FC = () => {
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

    // Honeypot bot check
    if (formData.honeypot) return;

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
      // If EmailJS keys are configured, send via EmailJS (direct to Gmail)
      if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY) {
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          {
            from_name: formData.name,
            from_email: formData.email,
            message: formData.message,
            reply_to: formData.email,
          },
          EMAILJS_PUBLIC_KEY
        );
      } else {
        // Fallback: send via our API route (Nodemailer / Firestore backup)
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Failed to send message");
        }
      }

      setStatus("success");
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 },
        colors: ["#00FF9F", "#00D4FF", "#38bdf8", "#6366F1"],
      });
      setFormData({ name: "", email: "", message: "", honeypot: "" });
    } catch (err: unknown) {
      setStatus("error");
      const msg =
        err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setErrorMessage(msg);
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[var(--sky-primary)] focus:ring-1 focus:ring-[var(--sky-primary)] transition-all font-sans";

  return (
    <section id="contact" className="relative py-28 px-4 sm:px-6 max-w-4xl mx-auto">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-10">
        <span className="text-xs font-mono uppercase tracking-widest text-[var(--sky-secondary)]">
          05 // CONTACT &amp; INQUIRIES
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
            Have an ambitious concept, collaboration opportunity, or role in mind? Drop a
            transmission below.
          </p>
        </div>

        <GlassCard
          className="p-8 sm:p-10 border border-white/10 max-w-2xl mx-auto"
          tilt={false}
        >
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
                Your message is on its way. I&apos;ll get back to you as soon as possible!
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
              {/* Error banner */}
              {errorMessage && (
                <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Honeypot */}
              <input
                type="text"
                name="honeypot"
                value={formData.honeypot}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, honeypot: e.target.value }))
                }
                style={{ display: "none" }}
                tabIndex={-1}
                autoComplete="off"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-mono text-white/60 block">NAME *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ada Lovelace"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, name: e.target.value }))
                    }
                    className={inputClass}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono text-white/60 block">EMAIL *</label>
                  <input
                    type="email"
                    required
                    placeholder="ada@computing.org"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, email: e.target.value }))
                    }
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-white/60 block">MESSAGE *</label>
                <textarea
                  required
                  rows={5}
                  placeholder="Tell me about your project, timeline, or thoughts..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, message: e.target.value }))
                  }
                  className={`${inputClass} resize-none`}
                />
              </div>

              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[var(--sky-secondary)] to-[var(--sky-primary)] text-slate-950 font-semibold text-sm shadow-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === "submitting" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Transmitting…</span>
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
