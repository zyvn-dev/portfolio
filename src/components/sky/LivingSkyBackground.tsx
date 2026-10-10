"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { FallbackGradient } from "./FallbackGradient";

const WebGLAuroraShader = dynamic(
  () =>
    import("./WebGLAuroraShader").then((mod) => ({
      default: mod.WebGLAuroraShader,
    })),
  { ssr: false, loading: () => <FallbackGradient /> }
);

export const LivingSkyBackground: React.FC = () => {
  const [shouldRenderWebGL, setShouldRenderWebGL] = useState(false);

  useEffect(() => {
    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      setShouldRenderWebGL(false);
      return;
    }

    // Check WebGL support
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (gl) {
        setShouldRenderWebGL(true);
      } else {
        setShouldRenderWebGL(false);
      }
    } catch {
      setShouldRenderWebGL(false);
    }
  }, []);

  return (
    <>
      <FallbackGradient />
      {shouldRenderWebGL && <WebGLAuroraShader />}
      <div className="noise-overlay" aria-hidden="true" />
    </>
  );
};
