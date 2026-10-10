"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { useTimeAtmosphere } from "./TimeAtmosphereContext";
import { ATMOSPHERE_PALETTES } from "@/lib/time-atmosphere";

const VERTEX_SHADER = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform float uScroll;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;
  varying vec2 vUv;

  // Simplex-inspired 2D noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187,
                        0.366025403784439,
                       -0.577350269189626,
                        0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
      + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 st = gl_FragCoord.xy / uResolution.xy;
    st.y = 1.0 - st.y;

    // Mouse influence
    vec2 mouseNorm = uMouse;
    float distToMouse = length(st - mouseNorm);
    float mouseWave = sin(distToMouse * 10.0 - uTime * 2.0) * exp(-distToMouse * 3.0) * 0.12;

    // Scroll modulation
    float scrollOffset = uScroll * 0.0004;

    // Flowing noise layers
    vec2 q = vec2(0.0);
    q.x = snoise(st * 1.8 + vec2(uTime * 0.04, scrollOffset));
    q.y = snoise(st * 1.8 + vec2(uTime * 0.05 + 1.2, -scrollOffset));

    vec2 r = vec2(0.0);
    r.x = snoise(st * 2.4 + 1.0 * q + vec2(1.7, 9.2) + 0.08 * uTime + mouseWave);
    r.y = snoise(st * 2.4 + 1.0 * q + vec2(8.3, 2.8) + 0.06 * uTime);

    float f = snoise(st * 1.5 + r + vec2(mouseWave, 0.0));

    // Base background is dark void
    vec3 bgVoid = vec3(0.027, 0.035, 0.055);

    // Color mixing
    vec3 col = mix(bgVoid, uColorC, clamp(f * f * 2.2, 0.0, 1.0));
    col = mix(col, uColorA, clamp(length(q) * 0.85, 0.0, 1.0));
    col = mix(col, uColorB, clamp(r.x * r.x * 1.2, 0.0, 1.0));

    // Soft celestial vignette
    float vignette = 1.0 - smoothstep(0.4, 1.4, length(st - 0.5));
    col *= vignette * 0.95 + 0.05;

    gl_FragColor = vec4(col, 1.0);
  }
`;

export const WebGLAuroraShader: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { atmosphere } = useTimeAtmosphere();

  // Color targets for smooth interpolation
  const targetColorA = useRef(new THREE.Vector3());
  const targetColorB = useRef(new THREE.Vector3());
  const targetColorC = useRef(new THREE.Vector3());

  // Mouse coords
  const mouse = useRef({ x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 });
  const scrollY = useRef(0);

  useEffect(() => {
    const pal = ATMOSPHERE_PALETTES[atmosphere.period].threeColors;
    targetColorA.current.set(...pal.colorA);
    targetColorB.current.set(...pal.colorB);
    targetColorC.current.set(...pal.colorC);
  }, [atmosphere.period]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Setup scene & camera
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer({
      powerPreference: "high-performance",
      antialias: false,
      alpha: false,
      depth: false,
      stencil: false,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // Uniforms
    const pal = ATMOSPHERE_PALETTES[atmosphere.period].threeColors;
    const currentColorA = new THREE.Vector3(...pal.colorA);
    const currentColorB = new THREE.Vector3(...pal.colorB);
    const currentColorC = new THREE.Vector3(...pal.colorC);

    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uScroll: { value: 0 },
      uColorA: { value: currentColorA },
      uColorB: { value: currentColorB },
      uColorC: { value: currentColorC },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms,
      depthWrite: false,
      depthTest: false,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const quad = new THREE.Mesh(geometry, material);
    scene.add(quad);

    // Particles layer (subtle cosmic stardust)
    const particleCount = 70;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 2;
      positions[i + 1] = (Math.random() - 0.5) * 2;
      positions[i + 2] = 0;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 3.5,
      color: 0xffffff,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Listeners
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.targetX = e.clientX / window.innerWidth;
      mouse.current.targetY = e.clientY / window.innerHeight;
    };

    const handleScroll = () => {
      scrollY.current = window.scrollY || window.pageYOffset;
    };

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      uniforms.uResolution.value.set(width, height);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const render = () => {
      const elapsedTime = clock.getElapsedTime();
      uniforms.uTime.value = elapsedTime;

      // Smooth mouse lerping
      mouse.current.x += (mouse.current.targetX - mouse.current.x) * 0.05;
      mouse.current.y += (mouse.current.targetY - mouse.current.y) * 0.05;
      uniforms.uMouse.value.set(mouse.current.x, mouse.current.y);

      // Scroll uniform
      uniforms.uScroll.value = scrollY.current;

      // Smooth color transitions
      currentColorA.lerp(targetColorA.current, 0.03);
      currentColorB.lerp(targetColorB.current, 0.03);
      currentColorC.lerp(targetColorC.current, 0.03);

      // Gentle drift for particles
      const posAttr = particleGeo.attributes.position;
      const posArray = posAttr.array as Float32Array;
      for (let i = 1; i < posArray.length; i += 3) {
        posArray[i] += 0.0003;
        if (posArray[i] > 1) posArray[i] = -1;
      }
      posAttr.needsUpdate = true;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);

      geometry.dispose();
      material.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      aria-hidden="true"
    />
  );
};
