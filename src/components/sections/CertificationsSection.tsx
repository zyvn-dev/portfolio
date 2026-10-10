"use client";

import React from "react";
import { motion } from "framer-motion";
import { CertificationItem } from "@/lib/types";
import { GlassCard } from "../ui/GlassCard";
import { Award, ArrowUpRight, Calendar, ExternalLink } from "lucide-react";
import Image from "next/image";
import { EmptyPlaceholder } from "../ui/EmptyPlaceholder";

interface CertificationsSectionProps {
  certifications: CertificationItem[];
}

export const CertificationsSection: React.FC<CertificationsSectionProps> = ({
  certifications,
}) => {
  return (
    <section
      id="certifications"
      className="relative py-28 px-4 sm:px-6 max-w-6xl mx-auto"
    >
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-10">
        <span className="text-xs font-mono uppercase tracking-widest text-[var(--sky-accent)]">
          03 // CERTIFICATIONS & LICENSES
        </span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl"
        >
          <h3 className="text-3xl sm:text-4xl font-display font-semibold text-white tracking-tight">
            Accreditations & Specializations
          </h3>
          <p className="text-white/60 text-sm sm:text-base mt-2">
            Verified technical competencies, certifications, and advanced proficiencies.
          </p>
        </motion.div>

        {certifications.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {certifications.map((cert, idx) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
              >
                <GlassCard className="h-full flex flex-col justify-between p-6" tilt={true}>
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      {cert.badgeImageUrl ? (
                        <div className="relative w-12 h-12 rounded-2xl overflow-hidden glass-pill border border-white/10 shrink-0">
                          <Image
                            src={cert.badgeImageUrl}
                            alt={cert.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-2xl glass-pill flex items-center justify-center border border-white/10 shrink-0 text-[var(--sky-accent)]">
                          <Award className="w-6 h-6" />
                        </div>
                      )}

                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full glass-pill text-[11px] font-mono text-white/60">
                        <Calendar className="w-3 h-3 text-white/30" />
                        <span>{cert.issueYear}</span>
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base sm:text-lg font-display font-semibold text-white leading-snug">
                        {cert.title}
                      </h4>
                      <p className="text-xs font-mono text-[var(--sky-accent)] mt-1">
                        {cert.issuingOrganization}
                      </p>
                    </div>
                  </div>

                  {/* Show link button ONLY if credentialUrl is provided */}
                  {cert.credentialUrl && (
                    <div className="pt-6 border-t border-white/5 mt-4">
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-xs font-mono text-white/70 hover:text-white transition-colors group"
                      >
                        <span>Verify Credential</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-white/40 group-hover:text-[var(--sky-accent)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                      </a>
                    </div>
                  )}
                </GlassCard>
              </motion.div>
            ))}
          </div>
        ) : (
          <EmptyPlaceholder
            type="certifications"
            description="Verified certifications will appear here once saved in the admin panel."
          />
        )}
      </div>
    </section>
  );
};
