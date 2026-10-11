"use client";

import React from "react";
import { useTimeAtmosphere } from "./TimeAtmosphereContext";

export const FallbackGradient: React.FC = () => {
  const { atmosphere } = useTimeAtmosphere();
  const { colors } = atmosphere;

  return (
    <div
      className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Background base */}
      <div className="absolute inset-0 bg-[#050812]" />

      {/* Atmospheric radial orbs */}
      <div
        className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full blur-[140px] opacity-40 transition-all duration-1000"
        style={{ backgroundColor: colors.primary }}
      />
      <div
        className="absolute top-[40%] -right-[15%] w-[55vw] h-[55vw] rounded-full blur-[160px] opacity-30 transition-all duration-1000"
        style={{ backgroundColor: colors.accent }}
      />
      <div
        className="absolute -bottom-[20%] left-[25%] w-[50vw] h-[50vw] rounded-full blur-[150px] opacity-25 transition-all duration-1000"
        style={{ backgroundColor: colors.secondary }}
      />
    </div>
  );
};
