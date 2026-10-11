"use client";

import React, { useEffect, useRef } from "react";

// Floating binary/hex characters
const CHARS = "01010110011001000110000100110001001100110011010000110101001100110100001101000100 01 FF 00 A3 7F 1010 0110 1100";
const CHAR_POOL = "01".split("");

interface Particle {
  x: number;
  y: number;
  speed: number;
  opacity: number;
  size: number;
  char: string;
  drift: number;
}

export const CSTechBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0.5, y: 0.5 });
  const raf = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = window.innerWidth;
    let H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    // Generate floating binary particles
    const COUNT = Math.min(Math.floor((W * H) / 14000), 120);
    const particles: Particle[] = Array.from({ length: COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      speed: 0.15 + Math.random() * 0.35,
      opacity: 0.04 + Math.random() * 0.08,
      size: 9 + Math.floor(Math.random() * 5),
      char: CHAR_POOL[Math.floor(Math.random() * CHAR_POOL.length)],
      drift: (Math.random() - 0.5) * 0.4,
    }));

    // Circuit nodes
    interface Node { x: number; y: number; r: number; pulse: number; speed: number }
    const NODES: Node[] = Array.from({ length: 18 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: 1.5 + Math.random() * 2,
      pulse: Math.random() * Math.PI * 2,
      speed: 0.004 + Math.random() * 0.006,
    }));

    let t = 0;

    const draw = () => {
      t += 1;

      // Deep dark base
      ctx.fillStyle = "#050A0F";
      ctx.fillRect(0, 0, W, H);

      // ── Cursor radial glow ────────────────────────────────────────────────
      const gx = mouse.current.x * W;
      const gy = mouse.current.y * H;
      const grd = ctx.createRadialGradient(gx, gy, 0, gx, gy, W * 0.35);
      grd.addColorStop(0, "rgba(0,212,255,0.09)");
      grd.addColorStop(0.5, "rgba(0,255,159,0.04)");
      grd.addColorStop(1, "transparent");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, W, H);

      // ── Circuit grid lines ────────────────────────────────────────────────
      const GRID = 64;
      ctx.strokeStyle = "rgba(0,212,255,0.045)";
      ctx.lineWidth = 0.5;
      for (let x = 0; x < W; x += GRID) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y < H; y += GRID) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      // ── Pulsing circuit nodes ─────────────────────────────────────────────
      NODES.forEach((n) => {
        n.pulse += n.speed;
        const alpha = 0.06 + 0.06 * Math.sin(n.pulse);
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,212,255,${alpha})`;
        ctx.fill();
        // Connect nearby nodes with faint lines
        NODES.forEach((m) => {
          const dx = m.x - n.x, dy = m.y - n.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 160 && d > 0) {
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(m.x, m.y);
            ctx.strokeStyle = `rgba(0,212,255,${0.025 * (1 - d / 160)})`;
            ctx.lineWidth = 0.4;
            ctx.stroke();
          }
        });
      });

      // ── Floating binary characters ────────────────────────────────────────
      ctx.font = `${particles[0]?.size ?? 11}px 'Courier New', monospace`;
      particles.forEach((p) => {
        // Randomise char occasionally
        if (Math.random() < 0.004) p.char = CHAR_POOL[Math.floor(Math.random() * CHAR_POOL.length)];
        p.y -= p.speed;
        p.x += p.drift * 0.3;
        if (p.y < -20) { p.y = H + 10; p.x = Math.random() * W; }
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        ctx.font = `${p.size}px 'Courier New', monospace`;
        ctx.fillStyle = `rgba(0,255,159,${p.opacity})`;
        ctx.fillText(p.char, p.x, p.y);
      });

      raf.current = requestAnimationFrame(draw);
    };

    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX / W;
      mouse.current.y = e.clientY / H;
    };
    const onResize = () => {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W; canvas.height = H;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("resize", onResize);
    draw();

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
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
