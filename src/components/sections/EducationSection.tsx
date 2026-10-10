"use client";

import React from "react";
import { motion } from "framer-motion";
import { EducationItem } from "@/lib/types";
import { GlassCard } from "../ui/GlassCard";
import { GraduationCap, Calendar, Building2 } from "lucide-react";
import Image from "next/image";
import { EmptyPlaceholder } from "../ui/EmptyPlaceholder";

interface EducationSectionProps {
  education: EducationItem[];
}

export const EducationSection: React.FC<EducationSectionProps> = ({ education }) => {
  return (
    <section id="education" className="relative py-28 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-10">
        <span className="text-xs font-mono uppercase tracking-widest text-[var(--sky-secondary)]">
          02 // EDUCATION & ACADEMIA
        </span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mb-8"
        >
          <h3 className="text-3xl sm:text-4xl font-display font-semibold text-white tracking-tight">
            Academic Background
          </h3>
          <p className="text-white/60 text-sm sm:text-base mt-2">
            Theoretical grounding, core computer science disciplines, and lifelong study.
          </p>
        </motion.div>

        {education.length > 0 ? (
          <div className="relative border-l border-white/10 ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-8">
            {education.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative group"
              >
                {/* Timeline node */}
                <div className="absolute -left-[31px] sm:-left-[47px] top-6 w-3 h-3 rounded-full bg-[var(--sky-secondary)] ring-4 ring-slate-950 group-hover:scale-125 transition-transform" />

                <GlassCard className="p-6 sm:p-8" tilt={false}>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {item.logoUrl ? (
                        <div className="relative w-14 h-14 rounded-2xl overflow-hidden glass-pill border border-white/10 shrink-0">
                          <Image
                            src={item.logoUrl}
                            alt={item.institution}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-14 h-14 rounded-2xl glass-pill flex items-center justify-center border border-white/10 shrink-0 text-[var(--sky-secondary)]">
                          <Building2 className="w-6 h-6" />
                        </div>
                      )}

                      <div className="space-y-1">
                        <h4 className="text-lg sm:text-xl font-display font-semibold text-white">
                          {item.institution}
                        </h4>
                        <div className="text-sm font-medium text-[var(--sky-secondary)]">
                          {item.degreeLevel}
                          {item.fieldOfStudy ? ` • ${item.fieldOfStudy}` : ""}
                        </div>
                      </div>
                    </div>

                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill text-xs font-mono text-white/70 self-start sm:self-auto">
                      <Calendar className="w-3.5 h-3.5 text-white/40" />
                      <span>
                        {item.startYear} – {item.endYear}
                      </span>
                    </div>
                  </div>

                  {item.description && (
                    <p className="mt-4 pt-4 border-t border-white/5 text-sm text-white/60 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </GlassCard>
              </motion.div>
            ))}
          </div>
        ) : (
          <EmptyPlaceholder
            type="education"
            description="Academic qualifications will appear here once submitted in the admin panel."
          />
        )}
      </div>
    </section>
  );
};
