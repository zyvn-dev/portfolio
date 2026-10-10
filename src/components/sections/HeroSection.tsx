"use client";

import React from "react";
import { motion } from "framer-motion";
import { ProfileData } from "@/lib/types";
import { useTimeAtmosphere } from "../sky/TimeAtmosphereContext";
import { KineticText } from "../ui/KineticText";
import { MagneticButton } from "../ui/MagneticButton";
import { ArrowDown, Sparkles, MapPin, Briefcase } from "lucide-react";
import Image from "next/image";

interface HeroSectionProps {
  profile: ProfileData | null;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ profile }) => {
  const { atmosphere } = useTimeAtmosphere();

  // If no profile data yet, show elegant, neutral template state
  const displayName = profile?.fullName || "Your Name";
  const displayGreeting = profile?.greetingName
    ? `${atmosphere.greeting}, I'm ${profile.greetingName}`
    : `${atmosphere.greeting}, Welcome`;
  const displayHeadline =
    profile?.headline || "Product Designer & Full-Stack Creative Developer";
  const displayIntro =
    profile?.shortIntro ||
    "Crafting immersive digital experiences, fluid interfaces, and resilient web architectures.";

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 pt-28 pb-16 overflow-hidden"
    >
      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Column: Greeting, Kinetic Name, Headline & CTAs */}
        <div className="lg:col-span-7 flex flex-col items-start space-y-6 text-left">
          {/* Live Greeting Chip */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full glass-pill border border-white/10 text-xs font-mono text-white/80"
          >
            <div className="w-2 h-2 rounded-full bg-[var(--sky-primary)] animate-ping" />
            <span>{displayGreeting}</span>
            <span className="text-white/20">•</span>
            <span className="text-white/50">{atmosphere.timeString}</span>
          </motion.div>

          {/* Kinetic Typography for Full Name */}
          <div className="space-y-3">
            <KineticText
              text={displayName}
              tag="h1"
              delay={0.15}
              className="text-4xl sm:text-6xl md:text-7xl font-display font-bold tracking-tight text-gradient leading-[1.08]"
            />

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-xl sm:text-2xl md:text-3xl font-display font-medium text-gradient-sky"
            >
              {displayHeadline}
            </motion.h2>
          </div>

          {/* Short Intro */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-base sm:text-lg text-white/60 max-w-xl leading-relaxed"
          >
            {displayIntro}
          </motion.p>

          {/* Location & Status indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap items-center gap-4 text-xs font-mono text-white/50 pt-1"
          >
            {profile?.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[var(--sky-secondary)]" />
                <span>{profile.location}</span>
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
              <span>Available for collaborations</span>
            </span>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="flex flex-wrap items-center gap-4 pt-4"
          >
            <MagneticButton
              variant="primary"
              onClick={() => {
                document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <span>Explore Projects</span>
            </MagneticButton>

            <MagneticButton
              variant="glass"
              onClick={() => {
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <span>Contact Me</span>
            </MagneticButton>
          </motion.div>
        </div>

        {/* Right Column: Organic Morphing Avatar Mask with Parallax Tilt */}
        <div className="lg:col-span-5 flex justify-center items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-72 h-72 sm:w-88 sm:h-88 md:w-96 md:h-96"
          >
            {/* Background glowing halo */}
            <div className="absolute inset-0 rounded-full blur-3xl opacity-40 bg-gradient-to-tr from-[var(--sky-primary)] via-[var(--sky-secondary)] to-[var(--sky-accent)] animate-pulse-glow" />

            {/* Organic morph mask container */}
            <div
              className="relative w-full h-full glass-panel overflow-hidden border border-white/15 p-2 shadow-2xl transition-all duration-700 hover:border-white/30"
              style={{
                borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
                animation: "float 9s ease-in-out infinite",
              }}
            >
              {profile?.avatarUrl ? (
                <Image
                  src={profile.avatarUrl}
                  alt={displayName}
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  priority
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-white/10 via-slate-900/60 to-black/80 p-6 text-center">
                  <Sparkles className="w-12 h-12 text-[var(--sky-primary)] mb-3 animate-pulse" />
                  <span className="text-sm font-medium text-white/80">
                    Portrait Ready
                  </span>
                  <span className="text-xs text-white/40 mt-1 max-w-[160px]">
                    Upload avatar via /admin
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll down indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 text-xs font-mono"
      >
        <span>SCROLL</span>
        <ArrowDown className="w-3.5 h-3.5 animate-bounce text-[var(--sky-primary)]" />
      </motion.div>
    </section>
  );
};
