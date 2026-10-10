import React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div
      className={cn(
        "rounded-xl bg-white/5 skeleton-shimmer overflow-hidden",
        className
      )}
    />
  );
};

export const SkeletonCard: React.FC<{ type?: "project" | "timeline" | "cert" }> = ({
  type = "project",
}) => {
  if (type === "timeline") {
    return (
      <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
        <div className="flex items-center gap-4">
          <Skeleton className="w-12 h-12 rounded-2xl" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
    );
  }

  if (type === "cert") {
    return (
      <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
        <div className="flex items-start justify-between">
          <Skeleton className="w-12 h-12 rounded-2xl" />
          <Skeleton className="h-4 w-12 rounded-full" />
        </div>
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-3xl p-6 border border-white/5 space-y-4">
      <Skeleton className="w-full h-48 rounded-2xl" />
      <div className="space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
    </div>
  );
};
