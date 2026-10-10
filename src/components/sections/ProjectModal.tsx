"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProjectItem } from "@/lib/types";
import { X, ExternalLink, Github, Layers, ArrowUpRight } from "lucide-react";
import Image from "next/image";

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (project) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-2xl"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 30 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-3xl w-full glass-panel bg-slate-900/90 rounded-3xl border border-white/15 p-6 sm:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full glass-pill text-white/60 hover:text-white transition-colors border border-white/10"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Cover image */}
          {project.coverImageUrl && (
            <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden mb-6 border border-white/10">
              <Image
                src={project.coverImageUrl}
                alt={project.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Header */}
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {project.tags?.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 rounded-full text-[11px] font-mono glass-pill text-[var(--sky-secondary)] border-white/10"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <h3 className="text-2xl sm:text-3xl font-display font-bold text-white">
              {project.title}
            </h3>

            <p className="text-base text-white/70 leading-relaxed font-sans">
              {project.summary}
            </p>
          </div>

          {/* Full Details */}
          <div className="mt-6 pt-6 border-t border-white/10 space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-wider text-white/40 font-semibold">
              Project Architecture & Detailed Scope
            </h4>
            <div className="text-sm text-white/60 whitespace-pre-line leading-relaxed">
              {project.fullDescription || project.summary}
            </div>
          </div>

          {/* Links list */}
          {project.links && project.links.length > 0 && (
            <div className="mt-8 pt-6 border-t border-white/10">
              <h4 className="text-xs font-mono uppercase tracking-wider text-white/40 font-semibold mb-3">
                Live Deployment & Source Code
              </h4>
              <div className="flex flex-wrap gap-3">
                {project.links.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-pill hover:bg-white/15 text-xs font-mono text-white transition-all group border-white/10 hover:border-white/20 active:scale-95"
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-white/40 group-hover:text-[var(--sky-primary)] transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
