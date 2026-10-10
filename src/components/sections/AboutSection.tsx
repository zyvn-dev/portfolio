"use client";

import React from "react";
import { motion } from "framer-motion";
import { ProfileData } from "@/lib/types";
import { GlassCard } from "../ui/GlassCard";
import {
  FileText,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Globe,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

interface AboutSectionProps {
  profile: ProfileData | null;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ profile }) => {
  const bioParagraphs = profile?.bioParagraphs && profile.bioParagraphs.length > 0
    ? profile.bioParagraphs
    : [
        "Welcome to this living space. Every section, artifact, and project showcased here is completely configurable through the private administrative console.",
        "Engineered with a focus on liquid performance, accessibility, and modern interactive aesthetics that react dynamically to the visitor's local daylight cycle.",
      ];

  const socials = profile?.socials || {};

  const socialItems = [
    { name: "GitHub", url: socials.github, icon: Github },
    { name: "LinkedIn", url: socials.linkedin, icon: Linkedin },
    { name: "Twitter / X", url: socials.twitter, icon: Twitter },
    { name: "Instagram", url: socials.instagram, icon: Instagram },
    { name: "Personal Web", url: socials.website, icon: Globe },
  ].filter((item) => !!item.url);

  return (
    <section id="about" className="relative py-28 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-10">
        <span className="text-xs font-mono uppercase tracking-widest text-[var(--sky-primary)]">
          01 // ABOUT
        </span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Narrative Bio */}
        <div className="lg:col-span-8 space-y-6">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-display font-semibold text-white tracking-tight"
          >
            Philosophy & Creative Direction
          </motion.h3>

          <div className="space-y-4 text-white/70 text-base sm:text-lg leading-relaxed">
            {bioParagraphs.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          {/* Resume Download CTA (If provided) */}
          {profile?.resumeUrl && (
            <div className="pt-4">
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium text-sm border border-white/15 transition-all duration-200 active:scale-95 group"
              >
                <FileText className="w-4 h-4 text-[var(--sky-primary)]" />
                <span>Download Curriculum Vitae</span>
                <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
              </a>
            </div>
          )}
        </div>

        {/* Right Column: Social Links Bento */}
        <div className="lg:col-span-4 space-y-4">
          <GlassCard className="space-y-4" tilt={false}>
            <div className="flex items-center gap-2 text-white/80 font-medium text-sm">
              <Sparkles className="w-4 h-4 text-[var(--sky-secondary)]" />
              <span>Connect & Networks</span>
            </div>

            {socialItems.length > 0 ? (
              <div className="space-y-2 pt-1">
                {socialItems.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] text-white/70 hover:text-white border border-white/5 hover:border-white/15 transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 text-white/60 group-hover:text-[var(--sky-primary)] transition-colors" />
                        <span className="text-xs font-mono">{social.name}</span>
                      </div>
                      <ArrowUpRight className="w-3.5 h-3.5 text-white/30 group-hover:text-white transition-colors" />
                    </a>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-white/40 font-mono py-4">
                Social links will appear here once configured in the admin dashboard.
              </p>
            )}

            {profile?.email && (
              <div className="pt-2 border-t border-white/10">
                <span className="text-[11px] font-mono text-white/40 block mb-1">
                  DIRECT INQUIRIES
                </span>
                <a
                  href={`mailto:${profile.email}`}
                  className="text-xs font-mono text-[var(--sky-secondary)] hover:underline truncate block"
                >
                  {profile.email}
                </a>
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </section>
  );
};
