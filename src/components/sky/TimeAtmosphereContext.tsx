"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { TimeAtmosphereState, TimePeriod } from "@/lib/types";
import { getCurrentAtmosphere, ATMOSPHERE_PALETTES } from "@/lib/time-atmosphere";

interface TimeAtmosphereContextValue {
  atmosphere: TimeAtmosphereState;
  overridePeriod: TimePeriod | null;
  setOverridePeriod: (period: TimePeriod | null) => void;
  availablePeriods: { id: TimePeriod; label: string }[];
}

const TimeAtmosphereContext = createContext<TimeAtmosphereContextValue | null>(null);

export const TimeAtmosphereProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [overridePeriod, setOverridePeriod] = useState<TimePeriod | null>(null);
  const [atmosphere, setAtmosphere] = useState<TimeAtmosphereState>(() =>
    getCurrentAtmosphere()
  );

  useEffect(() => {
    // Initial sync
    setAtmosphere(getCurrentAtmosphere(overridePeriod ?? undefined));

    // Update time ticker every second for live digital clock & period changes
    const interval = setInterval(() => {
      setAtmosphere(getCurrentAtmosphere(overridePeriod ?? undefined));
    }, 1000);

    return () => clearInterval(interval);
  }, [overridePeriod]);

  // Sync CSS variables to root element
  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    const { colors } = atmosphere;
    root.style.setProperty("--sky-primary", colors.primary);
    root.style.setProperty("--sky-secondary", colors.secondary);
    root.style.setProperty("--sky-accent", colors.accent);
    root.style.setProperty("--sky-glow", colors.glow);
    root.style.setProperty("--sky-surface", colors.surface);
  }, [atmosphere]);

  const availablePeriods: { id: TimePeriod; label: string }[] = [
    { id: "dawn", label: "Dawn (5:00 - 11:59)" },
    { id: "day", label: "Day (12:00 - 16:59)" },
    { id: "dusk", label: "Dusk (17:00 - 20:59)" },
    { id: "night", label: "Night (21:00 - 4:59)" },
  ];

  return (
    <TimeAtmosphereContext.Provider
      value={{
        atmosphere,
        overridePeriod,
        setOverridePeriod,
        availablePeriods,
      }}
    >
      {children}
    </TimeAtmosphereContext.Provider>
  );
};

export function useTimeAtmosphere(): TimeAtmosphereContextValue {
  const context = useContext(TimeAtmosphereContext);
  if (!context) {
    throw new Error("useTimeAtmosphere must be used within a TimeAtmosphereProvider");
  }
  return context;
}
