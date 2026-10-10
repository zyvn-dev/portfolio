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
    label: "Terminal Dawn",
    greeting: "Good morning",
    colors: {
      primary: "#00D4FF",
      secondary: "#0099CC",
      accent: "#7B68EE",
      surface: "rgba(0, 212, 255, 0.06)",
      glow: "rgba(0, 212, 255, 0.35)",
      gradient: "from-cyan-500/15 via-blue-600/10 to-indigo-600/10",
    },
    threeColors: {
      colorA: [0.0,  0.53, 0.72],
      colorB: [0.18, 0.22, 0.62],
      colorC: [0.03, 0.06, 0.14],
      particleColor: [0.5, 0.85, 1.0],
    },
  },
  day: {
    label: "Sapphire Core",
    greeting: "Good afternoon",
    colors: {
      primary: "#3B82F6",
      secondary: "#60A5FA",
      accent: "#06B6D4",
      surface: "rgba(59, 130, 246, 0.07)",
      glow: "rgba(59, 130, 246, 0.40)",
      gradient: "from-blue-500/20 via-cyan-500/10 to-sky-600/10",
    },
    threeColors: {
      colorA: [0.04, 0.2,  0.62],
      colorB: [0.02, 0.55, 0.78],
      colorC: [0.02, 0.05, 0.13],
      particleColor: [0.55, 0.75, 1.0],
    },
  },
  dusk: {
    label: "Indigo Drift",
    greeting: "Good evening",
    colors: {
      primary: "#818CF8",
      secondary: "#6366F1",
      accent: "#38BDF8",
      surface: "rgba(99, 102, 241, 0.07)",
      glow: "rgba(129, 140, 248, 0.38)",
      gradient: "from-indigo-500/20 via-blue-600/10 to-cyan-500/10",
    },
    threeColors: {
      colorA: [0.22, 0.25, 0.85],
      colorB: [0.03, 0.45, 0.75],
      colorC: [0.03, 0.04, 0.12],
      particleColor: [0.6, 0.65, 1.0],
    },
  },
  night: {
    label: "Deep Space",
    greeting: "Good night",
    colors: {
      primary: "#22D3EE",
      secondary: "#0EA5E9",
      accent: "#6366F1",
      surface: "rgba(34, 211, 238, 0.06)",
      glow: "rgba(34, 211, 238, 0.32)",
      gradient: "from-cyan-500/15 via-indigo-700/10 to-slate-900/10",
    },
    threeColors: {
      colorA: [0.02, 0.55, 0.65],
      colorB: [0.2,  0.22, 0.78],
      colorC: [0.01, 0.04, 0.10],
      particleColor: [0.3, 0.92, 1.0],
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
