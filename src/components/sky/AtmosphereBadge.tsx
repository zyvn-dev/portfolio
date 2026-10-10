"use client";

import React, { useState } from "react";
import { useTimeAtmosphere } from "./TimeAtmosphereContext";
import { Sparkles, Sun, Moon, Sunrise, Sunset, Clock } from "lucide-react";
import { TimePeriod } from "@/lib/types";

export const AtmosphereBadge: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { atmosphere, overridePeriod, setOverridePeriod, availablePeriods } = useTimeAtmosphere();
  const [showMenu, setShowMenu] = useState(false);

  const getIcon = () => {
    switch (atmosphere.period) {
      case "dawn":
        return <Sunrise className="w-3.5 h-3.5 text-rose-300 animate-pulse" />;
      case "day":
        return <Sun className="w-3.5 h-3.5 text-sky-300 animate-spin-slow" />;
      case "dusk":
        return <Sunset className="w-3.5 h-3.5 text-amber-300 animate-pulse" />;
      case "night":
      default:
        return <Moon className="w-3.5 h-3.5 text-teal-300" />;
    }
  };

  return (
    <div className="relative inline-block text-xs font-mono">
      <button
        type="button"
        onClick={() => setShowMenu((prev) => !prev)}
        className="glass-pill px-3 py-1.5 rounded-full flex items-center gap-2 text-white/80 hover:text-white transition-all duration-200 border border-white/10 hover:border-white/20 active:scale-95"
        title="Click to preview sky atmosphere by time"
      >
        <span className="flex items-center gap-1.5">
          {getIcon()}
          <span className="font-medium text-white/90">{atmosphere.label}</span>
        </span>
        <span className="text-white/30">|</span>
        <span className="flex items-center gap-1 text-white/60">
          <Clock className="w-3 h-3 text-white/40" />
          <span>{atmosphere.timeString}</span>
        </span>
        {overridePeriod && (
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
        )}
      </button>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 mt-2 w-56 rounded-2xl glass-panel p-2 shadow-2xl z-50 border border-white/10 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-2.5 py-1.5 text-[10px] uppercase tracking-wider text-white/40 font-semibold">
              The Living Sky Simulation
            </div>
            <div className="space-y-1 mt-1">
              <button
                type="button"
                onClick={() => {
                  setOverridePeriod(null);
                  setShowMenu(false);
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                  overridePeriod === null
                    ? "bg-white/15 text-white font-medium"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-3 h-3 text-cyan-300" />
                  Live Local Time (Auto)
                </span>
                {overridePeriod === null && (
                  <span className="text-[10px] text-cyan-400 font-bold">ACTIVE</span>
                )}
              </button>

              {availablePeriods.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setOverridePeriod(p.id);
                    setShowMenu(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                    overridePeriod === p.id
                      ? "bg-white/15 text-white font-medium"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span>{p.label}</span>
                  {overridePeriod === p.id && (
                    <span className="text-[10px] text-amber-400 font-bold">MANUAL</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
