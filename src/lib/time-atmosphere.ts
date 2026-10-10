import { TimeAtmosphereState, TimePeriod } from "./types";

export const ATMOSPHERE_PALETTES: Record<
  TimePeriod,
  {
    label: string;
    greeting: string;
    colors: TimeAtmosphereState["colors"];
    threeColors: {
      colorA: [number, number, number]; // RGB normalized 0-1
      colorB: [number, number, number];
      colorC: [number, number, number];
      particleColor: [number, number, number];
    };
  }
> = {
  dawn: {
    label: "Dawn Twilight",
    greeting: "Good morning",
    colors: {
      primary: "#FF7E95",
      secondary: "#FFE3D8",
      accent: "#FDBB2D",
      surface: "rgba(255, 126, 149, 0.08)",
      glow: "rgba(255, 126, 149, 0.45)",
      gradient: "from-rose-500/20 via-orange-400/10 to-amber-300/10",
    },
    threeColors: {
      colorA: [1.0, 0.49, 0.58], // Rose #FF7E95
      colorB: [1.0, 0.73, 0.18], // Amber #FDBB2D
      colorC: [0.38, 0.16, 0.35], // Deep plum
      particleColor: [1.0, 0.89, 0.85], // Warm peach
    },
  },
  day: {
    label: "Radiant Day",
    greeting: "Good afternoon",
    colors: {
      primary: "#0284C7",
      secondary: "#38BDF8",
      accent: "#22D3EE",
      surface: "rgba(56, 189, 248, 0.08)",
      glow: "rgba(56, 189, 248, 0.45)",
      gradient: "from-sky-500/20 via-cyan-400/10 to-blue-500/10",
    },
    threeColors: {
      colorA: [0.01, 0.52, 0.78], // Azure #0284C7
      colorB: [0.13, 0.83, 0.93], // Cyan #22D3EE
      colorC: [0.08, 0.18, 0.38], // Deep navy
      particleColor: [0.65, 0.92, 1.0], // Sky crystal
    },
  },
  dusk: {
    label: "Golden Dusk",
    greeting: "Good evening",
    colors: {
      primary: "#8B5CF6",
      secondary: "#EC4899",
      accent: "#F59E0B",
      surface: "rgba(139, 92, 246, 0.08)",
      glow: "rgba(139, 92, 246, 0.45)",
      gradient: "from-purple-600/20 via-pink-500/15 to-amber-500/10",
    },
    threeColors: {
      colorA: [0.55, 0.36, 0.96], // Violet #8B5CF6
      colorB: [0.93, 0.28, 0.6],  // Magenta #EC4899
      colorC: [0.96, 0.62, 0.04], // Amber #F59E0B
      particleColor: [0.98, 0.82, 0.95], // Lilac glow
    },
  },
  night: {
    label: "Nocturnal Sky",
    greeting: "Good night",
    colors: {
      primary: "#14B8A6",
      secondary: "#2DD4BF",
      accent: "#6366F1",
      surface: "rgba(20, 184, 166, 0.08)",
      glow: "rgba(45, 212, 191, 0.45)",
      gradient: "from-teal-500/20 via-indigo-600/15 to-emerald-500/10",
    },
    threeColors: {
      colorA: [0.08, 0.72, 0.65], // Teal #14B8A6
      colorB: [0.39, 0.4, 0.95],  // Indigo #6366F1
      colorC: [0.04, 0.07, 0.15], // Obsidian midnight
      particleColor: [0.45, 0.98, 0.88], // Electric teal stardust
    },
  },
};

export function getTimePeriodForHour(hour: number): TimePeriod {
  if (hour >= 5 && hour < 12) return "dawn";
  if (hour >= 12 && hour < 17) return "day";
  if (hour >= 17 && hour < 21) return "dusk";
  return "night";
}

export function getCurrentAtmosphere(override?: TimePeriod): TimeAtmosphereState {
  const now = new Date();
  const hour = now.getHours();
  const period = override || getTimePeriodForHour(hour);
  const palette = ATMOSPHERE_PALETTES[period];

  const timeString = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  return {
    period,
    label: palette.label,
    greeting: palette.greeting,
    hour,
    timeString,
    colors: palette.colors,
  };
}
