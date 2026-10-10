import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        skyAtmosphere: {
          dawn: {
            rose: "#FF7E95",
            peach: "#FFE3D8",
            amber: "#FDBB2D",
            accent: "#F43F5E",
            surface: "rgba(255, 227, 216, 0.06)",
          },
          day: {
            azure: "#0284C7",
            sky: "#38BDF8",
            cyan: "#22D3EE",
            accent: "#0EA5E9",
            surface: "rgba(56, 189, 248, 0.06)",
          },
          dusk: {
            violet: "#8B5CF6",
            magenta: "#EC4899",
            amber: "#F59E0B",
            accent: "#A855F7",
            surface: "rgba(139, 92, 246, 0.06)",
          },
          night: {
            indigo: "#0F172A",
            teal: "#14B8A6",
            neonTeal: "#2DD4BF",
            accent: "#06B6D4",
            surface: "rgba(20, 184, 166, 0.06)",
          },
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        "glass-sm": "0 4px 16px 0 rgba(0, 0, 0, 0.25)",
        "glow-sky": "0 0 50px -10px var(--sky-glow, rgba(56, 189, 248, 0.35))",
      },
      backdropBlur: {
        xs: "2px",
        "2xl": "40px",
        "3xl": "64px",
      },
      animation: {
        "float-slow": "float 8s ease-in-out infinite",
        "pulse-glow": "pulseGlow 4s ease-in-out infinite",
        "spin-slow": "spin 25s linear infinite",
        shimmer: "shimmer 2.2s infinite linear",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.05)" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
