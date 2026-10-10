"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

interface KineticTextProps {
  text: string;
  className?: string;
  tag?: "h1" | "h2" | "h3" | "span" | "p";
  delay?: number;
  byWord?: boolean;
}

export const KineticText: React.FC<KineticTextProps> = ({
  text,
  className,
  tag = "h1",
  delay = 0,
  byWord = false,
}) => {
  const items = byWord ? text.split(" ") : text.split("");

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: byWord ? 0.08 : 0.03,
        delayChildren: delay,
      },
    },
  };

  const childVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 35,
      rotateX: -40,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring",
        damping: 18,
        stiffness: 140,
      },
    },
  };

  const Component = motion[tag] as any;

  return (
    <Component
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className={cn("inline-flex flex-wrap overflow-hidden", className)}
    >
      {items.map((item, index) => (
        <motion.span
          key={`${item}-${index}`}
          variants={childVariants}
          className="inline-block transform-gpu"
        >
          {item === " " ? "\u00A0" : item}
          {byWord && index < items.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </Component>
  );
};
