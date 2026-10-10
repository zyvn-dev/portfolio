"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  strength?: number; // 0.1 to 0.5
  className?: string;
  variant?: "primary" | "secondary" | "glass";
  onClick?: () => void;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  strength = 0.25,
  className,
  variant = "glass",
  onClick,
  ...props
}) => {
  const ref = useRef<HTMLButtonElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    x.set(distanceX * strength);
    y.set(distanceY * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-[var(--sky-secondary)] to-[var(--sky-primary)] text-slate-950 font-semibold shadow-lg shadow-[var(--sky-glow)] hover:brightness-110",
    secondary:
      "bg-white/10 hover:bg-white/20 text-white border border-white/15 backdrop-blur-md",
    glass:
      "glass-panel text-white/90 hover:text-white border-white/10 hover:border-white/25",
  };

  return (
    <motion.button
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={cn(
        "relative inline-flex items-center justify-center px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 active:scale-95 select-none",
        variantStyles[variant],
        className
      )}
      {...(props as any)}
    >
      {children}
    </motion.button>
  );
};
