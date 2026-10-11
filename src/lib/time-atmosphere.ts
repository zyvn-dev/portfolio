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
    label: "Cyber Dawn",
    greeting: "Good morning",
    colors: {
      primary: "#00D4FF", // Cyber Cyan
      secondary: "#00FF9F", // Neon Green
      accent: "#38BDF8", // Electric Sky
      surface: "rgba(0, 255, 159, 0.06)",
      glow: "rgba(0, 212, 255, 0.35)",
      gradient: "from-cyan-500/20 via-emerald-500/10 to-blue-500/10",
    },
    threeColors: {
      colorA: [0.0, 0.83, 1.0],
      colorB: [0.0, 1.0, 0.62],
      colorC: [0.02, 0.04, 0.09],
      particleColor: [0.0, 0.83, 1.0],
    },
  },
  day: {
    label: "Digital Matrix",
    greeting: "Good afternoon",
    colors: {
      primary: "#00FF9F", // Neon Green
      secondary: "#00D4FF", // Cyber Cyan
      accent: "#22D3EE", // Electric Cyan
      surface: "rgba(0, 212, 255, 0.06)",
      glow: "rgba(0, 255, 159, 0.35)",
      gradient: "from-emerald-500/20 via-cyan-500/15 to-teal-500/10",
    },
    threeColors: {
      colorA: [0.0, 1.0, 0.62],
      colorB: [0.0, 0.83, 1.0],
      colorC: [0.02, 0.04, 0.09],
      particleColor: [0.0, 1.0, 0.62],
    },
  },
  dusk: {
    label: "Neon Twilight",
    greeting: "Good evening",
    colors: {
      primary: "#00D4FF", // Cyber Cyan
      secondary: "#00FF9F", // Neon Green
      accent: "#14B8A6", // Electric Teal
      surface: "rgba(0, 255, 159, 0.06)",
      glow: "rgba(0, 212, 255, 0.35)",
      gradient: "from-cyan-500/20 via-teal-500/15 to-emerald-500/10",
    },
    threeColors: {
      colorA: [0.0, 0.83, 1.0],
      colorB: [0.0, 1.0, 0.62],
      colorC: [0.02, 0.04, 0.09],
      particleColor: [0.0, 0.83, 1.0],
    },
  },
  night: {
    label: "Deep Terminal",
    greeting: "Good night",
    colors: {
      primary: "#00FF9F", // Neon Green
      secondary: "#00D4FF", // Cyber Cyan
      accent: "#06B6D4", // Bright Cyan
      surface: "rgba(0, 212, 255, 0.06)",
      glow: "rgba(0, 255, 159, 0.35)",
      gradient: "from-emerald-500/20 via-cyan-500/15 to-slate-900/10",
    },
    threeColors: {
      colorA: [0.0, 1.0, 0.62],
      colorB: [0.0, 0.83, 1.0],
      colorC: [0.02, 0.04, 0.09],
      particleColor: [0.0, 1.0, 0.62],
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
