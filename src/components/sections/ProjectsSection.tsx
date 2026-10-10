"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ProjectItem } from "@/lib/types";
import { GlassCard } from "../ui/GlassCard";
import { ProjectModal } from "./ProjectModal";
import { ArrowUpRight, FolderGit2, Layers, ExternalLink } from "lucide-react";
import Image from "next/image";
import { EmptyPlaceholder } from "../ui/EmptyPlaceholder";

interface ProjectsSectionProps {
  projects: ProjectItem[];
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects }) => {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  return (
    <section id="projects" className="relative py-28 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-10">
        <span className="text-xs font-mono uppercase tracking-widest text-[var(--sky-primary)]">
          04 // SELECTED WORKS & VENTURES
        </span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <div className="space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
        >
          <div>
            <h3 className="text-3xl sm:text-4xl font-display font-semibold text-white tracking-tight">
              Featured Case Studies
            </h3>
            <p className="text-white/60 text-sm sm:text-base mt-2 max-w-xl">
              Engineered software products, interactive design systems, and web architectures.
            </p>
          </div>
          <span className="text-xs font-mono text-white/40">
            {projects.length} PROJECT{projects.length === 1 ? "" : "S"}
          </span>
        </motion.div>

        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, idx) => {
              const isLarge = project.featured || idx === 0;

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  className={isLarge ? "lg:col-span-2" : "col-span-1"}
                >
                  <GlassCard
                    onClick={() => setSelectedProject(project)}
                    className="h-full flex flex-col justify-between p-6 sm:p-7 group relative overflow-hidden"
                  >
                    <div className="space-y-4">
                      {/* Image Thumbnail with zoom effect */}
                      <div className="relative w-full h-52 sm:h-64 rounded-2xl overflow-hidden glass-pill border border-white/10">
                        {project.coverImageUrl ? (
                          <Image
                            src={project.coverImageUrl}
                            alt={project.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-white/[0.02]">
                            <FolderGit2 className="w-10 h-10 text-[var(--sky-primary)] opacity-40 mb-2" />
                            <span className="text-xs text-white/30 font-mono">
                              No Cover Image
                            </span>
                          </div>
                        )}

                        {/* Top corner pills */}
                        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                          {project.tags?.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-2.5 py-0.5 rounded-full text-[10px] font-mono glass-pill text-white/90 border-white/10"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="absolute top-3 right-3 z-10">
                          <div className="w-8 h-8 rounded-full glass-pill flex items-center justify-center text-white/70 group-hover:text-white group-hover:bg-white/20 transition-all">
                            <ArrowUpRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div>
                        <h4 className="text-xl font-display font-semibold text-white group-hover:text-gradient-sky transition-colors">
                          {project.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-white/60 line-clamp-2 mt-2 leading-relaxed">
                          {project.summary}
                        </p>
                      </div>
                    </div>

                    {/* Links Preview */}
                    <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2">
                        {project.links?.slice(0, 2).map((link, i) => (
                          <a
                            key={i}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-[11px] font-mono text-[var(--sky-secondary)] hover:underline flex items-center gap-1"
                          >
                            <span>{link.label}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        ))}
                      </div>

                      <span className="text-[11px] font-mono text-white/40 group-hover:text-white/80 transition-colors">
                        Inspect Details →
                      </span>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <EmptyPlaceholder
            type="projects"
            description="Projects and digital artifacts will appear here once published from the admin panel."
          />
        )}
      </div>

      {/* Detail Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
};
