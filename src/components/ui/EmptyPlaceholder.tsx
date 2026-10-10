import React from "react";
import { FolderGit2, GraduationCap, Award, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyPlaceholderProps {
  type: "projects" | "education" | "certifications" | "messages";
  title?: string;
  description?: string;
  className?: string;
}

export const EmptyPlaceholder: React.FC<EmptyPlaceholderProps> = ({
  type,
  title,
  description,
  className,
}) => {
  const getIcon = () => {
    switch (type) {
      case "projects":
        return <FolderGit2 className="w-8 h-8 text-[var(--sky-primary)]" />;
      case "education":
        return <GraduationCap className="w-8 h-8 text-[var(--sky-secondary)]" />;
      case "certifications":
        return <Award className="w-8 h-8 text-[var(--sky-accent)]" />;
      case "messages":
      default:
        return <Sparkles className="w-8 h-8 text-white/50" />;
    }
  };

  const defaultTitle = {
    projects: "Works in Progress",
    education: "Academic Milestones Coming Soon",
    certifications: "Credentials Loading",
    messages: "Inbox is Clean",
  }[type];

  const defaultDesc = {
    projects: "Featured developments are being prepared for public showcase.",
    education: "Academic history and qualifications will appear here shortly.",
    certifications: "Accreditations and industry licenses are being verified.",
    messages: "No contact submissions received yet.",
  }[type];

  return (
    <div
      className={cn(
        "glass-panel rounded-3xl p-10 border border-white/5 flex flex-col items-center justify-center text-center space-y-4 max-w-xl mx-auto my-6 relative overflow-hidden group",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
      <div className="w-16 h-16 rounded-2xl glass-pill flex items-center justify-center border border-white/10 group-hover:scale-105 transition-transform duration-300">
        {getIcon()}
      </div>
      <div className="space-y-1.5">
        <h4 className="text-lg font-medium text-white/90">
          {title || defaultTitle}
        </h4>
        <p className="text-sm text-white/50 max-w-md">
          {description || defaultDesc}
        </p>
      </div>
      <div className="h-1 w-12 rounded-full bg-gradient-to-r from-transparent via-[var(--sky-primary)] to-transparent opacity-60" />
    </div>
  );
};
