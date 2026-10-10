"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  tilt?: boolean;
  glow?: boolean;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  tilt = true,
  glow = true,
  onClick,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, active: false });
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePos({ x, y, active: true });

    if (tilt) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotX = ((y - centerY) / centerY) * -5;
      const rotY = ((x - centerX) / centerX) * 5;
      setRotate({ x: rotX, y: rotY });
    }
  };

  const handleMouseLeave = () => {
    setMousePos((prev) => ({ ...prev, active: false }));
    setRotate({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      animate={{
        rotateX: rotate.x,
        rotateY: rotate.y,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      style={{ transformStyle: "preserve-3d" }}
      className={cn(
        "relative rounded-3xl overflow-hidden glass-panel border border-white/10 p-6 transition-colors duration-300",
        onClick && "cursor-pointer",
        className
      )}
    >
      {/* Dynamic spotlight glow following cursor inside card */}
      {glow && mousePos.active && (
        <div
          className="pointer-events-none absolute -inset-px opacity-40 transition-opacity duration-300"
          style={{
            background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, var(--sky-glow, rgba(56, 189, 248, 0.3)), transparent 70%)`,
          }}
          aria-hidden="true"
        />
      )}

      {/* Subtle specular rim light */}
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl border border-white/10"
        aria-hidden="true"
      />

      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};
