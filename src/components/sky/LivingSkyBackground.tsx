"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Dark static fallback for prefers-reduced-motion or if canvas isn't ready
const StaticFallback: React.FC = () => (
  <div
    className="fixed inset-0 w-full h-full pointer-events-none z-0"
    style={{ background: "#050A0F" }}
    aria-hidden="true"
  />
);

const CSTechBackground = dynamic(
  () => import("./CSTechBackground").then((m) => ({ default: m.CSTechBackground })),
  { ssr: false, loading: () => <StaticFallback /> }
);

export const LivingSkyBackground: React.FC = () => {
  const [showCanvas, setShowCanvas] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!mq.matches) setShowCanvas(true);
  }, []);

  return (
    <>
      <StaticFallback />
      {showCanvas && <CSTechBackground />}
      <div className="noise-overlay" aria-hidden="true" />
    </>
  );
};
