"use client";

import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  speed: number;
  opacity: number;
  size: number;
  char: "0" | "1";
  drift: number;
  color: string;
}

interface CircuitTrace {
  x: number;
  y: number;
  length: number;
  horizontal: boolean;
  pulsePhase: number;
}

export const CSTechBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0.5, y: 0.5, currentX: 0.5, currentY: 0.5 });
  const raf = useRef<number>(0);

  useEffect(() => {
    // Check prefers-reduced-motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);
    const isMobile = W < 768;

    // Floating binary particles (0s and 1s, opacity 8-10%, slow upward drift)
    const count = isMobile ? 35 : Math.min(Math.floor((W * H) / 16000), 90);
    const particles: Particle[] = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      speed: 0.18 + Math.random() * 0.3,
      opacity: isMobile ? 0.06 : 0.08 + Math.random() * 0.02, // 8-10% on desktop
      size: isMobile ? 10 : 11 + Math.floor(Math.random() * 3),
      char: Math.random() > 0.5 ? "1" : "0",
      drift: (Math.random() - 0.5) * 0.25,
      color: Math.random() > 0.35 ? "#00D4FF" : "#00FF9F",
    }));

    // Circuit board grid nodes & traces
    const GRID = isMobile ? 80 : 64;
    const traces: CircuitTrace[] = [];
    for (let x = GRID; x < W; x += GRID * 2) {
      for (let y = GRID; y < H; y += GRID * 2) {
        if (Math.random() > 0.45) {
          traces.push({
            x,
            y,
            length: GRID * (1 + Math.floor(Math.random() * 2)),
            horizontal: Math.random() > 0.5,
            pulsePhase: Math.random() * Math.PI * 2,
          });
        }
      }
    }

    let frame = 0;

    const draw = () => {
      frame += 1;

      // ── 1. Deep Dark Base (#050812 with subtle gradient to #0A0E27) ───
      const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
      bgGrad.addColorStop(0, "#0A0E27");
      bgGrad.addColorStop(1, "#050812");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      // ── 2. Soft Cursor-Following Glow (cyan/green, diffuse, 12% opacity) ───
      mouse.current.currentX += (mouse.current.x - mouse.current.currentX) * 0.06;
      mouse.current.currentY += (mouse.current.y - mouse.current.currentY) * 0.06;
      const gx = mouse.current.currentX * W;
      const gy = mouse.current.currentY * H;
      const glowRadius = isMobile ? W * 0.4 : W * 0.32;

      const cursorGlow = ctx.createRadialGradient(gx, gy, 0, gx, gy, glowRadius);
      cursorGlow.addColorStop(0, "rgba(0, 212, 255, 0.12)"); // 12% diffuse cyan
      cursorGlow.addColorStop(0.4, "rgba(0, 255, 159, 0.05)"); // soft green ring
      cursorGlow.addColorStop(1, "rgba(0, 212, 255, 0)");
      ctx.fillStyle = cursorGlow;
      ctx.fillRect(0, 0, W, H);

      // ── 3. Animated Circuit Board Lines (thin cyan #00D4FF, ~6% opacity) ───
      const baseAlpha = isMobile ? 0.035 : 0.06;
      const pulseAlpha = baseAlpha + 0.02 * Math.sin(frame * 0.025);

      // Background circuit grid
      ctx.lineWidth = 0.6;
      ctx.strokeStyle = `rgba(0, 212, 255, ${baseAlpha * 0.6})`;
      for (let x = 0; x < W; x += GRID) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = 0; y < H; y += GRID) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      // Circuit PCB Traces and Nodes
      traces.forEach((t) => {
        const traceAlpha = baseAlpha + 0.025 * Math.sin(frame * 0.03 + t.pulsePhase);
        ctx.strokeStyle = `rgba(0, 212, 255, ${traceAlpha})`;
        ctx.lineWidth = 1.2;

        ctx.beginPath();
        ctx.moveTo(t.x, t.y);
        if (t.horizontal) {
          ctx.lineTo(t.x + t.length, t.y);
          // 45 degree turn on circuit trace
          ctx.lineTo(t.x + t.length + 12, t.y + 12);
        } else {
          ctx.lineTo(t.x, t.y + t.length);
          ctx.lineTo(t.x + 12, t.y + t.length + 12);
        }
        ctx.stroke();

        // Circuit node solder point
        ctx.beginPath();
        ctx.arc(t.x, t.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 159, ${traceAlpha * 1.5})`;
        ctx.fill();
      });

      // ── 4. Floating Binary Code (0s and 1s monospace, slow upward drift) ───
      particles.forEach((p) => {
        // Occasionally flip bit
        if (Math.random() < 0.005) {
          p.char = p.char === "0" ? "1" : "0";
        }

        p.y -= p.speed;
        p.x += p.drift * 0.3;

        // Wrap around
        if (p.y < -20) {
          p.y = H + 20;
          p.x = Math.random() * W;
        }
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;

        ctx.font = `${p.size}px 'Courier New', Courier, monospace`;
        ctx.fillStyle =
          p.color === "#00FF9F"
            ? `rgba(0, 255, 159, ${p.opacity})`
            : `rgba(0, 212, 255, ${p.opacity})`;
        ctx.fillText(p.char, p.x, p.y);
      });

      raf.current = requestAnimationFrame(draw);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX / W;
      mouse.current.y = e.clientY / H;
    };

    const handleResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("resize", handleResize);
    draw();

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      aria-hidden="true"
    />
  );
};
