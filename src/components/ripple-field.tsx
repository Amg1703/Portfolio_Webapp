"use client";

import { useEffect, useRef } from "react";

type Ripple = { x: number; y: number; born: number; life: number; maxR: number; strength: number };

const GAP = 26; // dot grid spacing (px)
const SPOT_R = 230; // cursor spotlight radius
const EMIT_EVERY = 46; // px of cursor travel between ripples
const MAX_RIPPLES = 28;

/**
 * Interactive background for the hero: a dot grid that lights up around the cursor,
 * with ripples that trail the pointer (and burst on click) and push the dots outward as they pass.
 * Rendered on one canvas; the animation loop only runs while something is visible.
 */
export function RippleField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0, dpr = 1;
    let colors = readColors();
    const ripples: Ripple[] = [];
    const target = { x: -9999, y: -9999 };
    const pos = { x: -9999, y: -9999 };
    let spot = 0; // spotlight strength, eases in/out
    let inside = false;
    let lastEmit: { x: number; y: number } | null = null;
    let raf = 0;

    function readColors() {
      const cs = getComputedStyle(document.documentElement);
      return { a: hexToRgb(cs.getPropertyValue("--accent")), b: hexToRgb(cs.getPropertyValue("--accent-2")) };
    }

    function resize() {
      const r = canvas!.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      kick();
    }

    function addRipple(x: number, y: number, maxR: number, life: number, strength: number, delay = 0) {
      ripples.push({ x, y, born: performance.now() + delay, life, maxR, strength });
      if (ripples.length > MAX_RIPPLES) ripples.shift();
    }

    function local(e: PointerEvent) {
      const r = canvas!.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top, ok: e.clientY >= r.top && e.clientY <= r.bottom && e.clientX >= r.left && e.clientX <= r.right };
    }

    function onMove(e: PointerEvent) {
      const p = local(e);
      inside = p.ok;
      if (!p.ok) return kick();
      target.x = p.x;
      target.y = p.y;
      if (pos.x < -999) { pos.x = p.x; pos.y = p.y; }
      if (!lastEmit || Math.hypot(p.x - lastEmit.x, p.y - lastEmit.y) > EMIT_EVERY) {
        addRipple(p.x, p.y, 120, 1300, 0.55);
        lastEmit = { x: p.x, y: p.y };
      }
      kick();
    }

    function onDown(e: PointerEvent) {
      const p = local(e);
      if (!p.ok) return;
      addRipple(p.x, p.y, 320, 1700, 1);
      addRipple(p.x, p.y, 240, 1500, 0.8, 120);
      addRipple(p.x, p.y, 160, 1300, 0.6, 240);
      kick();
    }

    function onLeave() {
      inside = false;
      kick();
    }

    function kick() {
      if (!raf) raf = requestAnimationFrame(frame);
    }

    function frame(now: number) {
      raf = 0;
      pos.x += (target.x - pos.x) * 0.14;
      pos.y += (target.y - pos.y) * 0.14;
      spot += ((inside ? 1 : 0) - spot) * 0.08;

      for (let i = ripples.length - 1; i >= 0; i--) if (now - ripples[i].born > ripples[i].life) ripples.splice(i, 1);

      ctx!.clearRect(0, 0, w, h);
      const { a, b } = colors;

      // Soft spotlight under the cursor
      if (spot > 0.01) {
        const g = ctx!.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, SPOT_R * 1.4);
        g.addColorStop(0, `rgba(${a},${0.16 * spot})`);
        g.addColorStop(0.5, `rgba(${b},${0.07 * spot})`);
        g.addColorStop(1, `rgba(${b},0)`);
        ctx!.fillStyle = g;
        ctx!.fillRect(pos.x - SPOT_R * 1.4, pos.y - SPOT_R * 1.4, SPOT_R * 2.8, SPOT_R * 2.8);
      }

      // Active ripples: progress 0..1, eased radius
      const live = ripples
        .filter((r) => now >= r.born)
        .map((r) => {
          const t = (now - r.born) / r.life;
          const ease = 1 - Math.pow(1 - t, 3);
          return { ...r, rad: ease * r.maxR, fade: (1 - t) * r.strength };
        });

      // Ring strokes
      for (const r of live) {
        ctx!.beginPath();
        ctx!.arc(r.x, r.y, r.rad, 0, Math.PI * 2);
        const grad = ctx!.createLinearGradient(r.x - r.rad, r.y, r.x + r.rad, r.y);
        grad.addColorStop(0, `rgba(${a},${0.5 * r.fade})`);
        grad.addColorStop(1, `rgba(${b},${0.5 * r.fade})`);
        ctx!.strokeStyle = grad;
        ctx!.lineWidth = 1.5 * r.fade + 0.3;
        ctx!.stroke();
      }

      // Dot grid lit by the spotlight and by passing ring fronts
      for (let gy = GAP / 2; gy < h; gy += GAP) {
        for (let gx = GAP / 2; gx < w; gx += GAP) {
          let light = 0, dx = 0, dy = 0;
          if (spot > 0.01) {
            const d = Math.hypot(gx - pos.x, gy - pos.y);
            if (d < SPOT_R) light = (1 - d / SPOT_R) ** 2 * 0.75 * spot;
          }
          for (const r of live) {
            const d = Math.hypot(gx - r.x, gy - r.y);
            const band = Math.abs(d - r.rad);
            if (band < 22 && d > 0) {
              const k = (1 - band / 22) * r.fade;
              light = Math.max(light, k);
              dx += ((gx - r.x) / d) * k * 5;
              dy += ((gy - r.y) / d) * k * 5;
            }
          }
          if (light < 0.03) continue;
          const mix = Math.min(1, Math.max(0, (gx - pos.x) / (SPOT_R * 2) + 0.5));
          ctx!.fillStyle = `rgba(${mix > 0.5 ? b : a},${Math.min(1, light)})`;
          const s = 1.2 + light * 1.8;
          ctx!.beginPath();
          ctx!.arc(gx + dx, gy + dy, s, 0, Math.PI * 2);
          ctx!.fill();
        }
      }

      if (live.length || ripples.length || spot > 0.01 || Math.abs(target.x - pos.x) > 0.5) kick();
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onTheme = () => { colors = readColors(); kick(); };
    mq.addEventListener("change", onTheme);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      mq.removeEventListener("change", onTheme);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="absolute inset-0 size-full" />;
}

function hexToRgb(hex: string) {
  const m = hex.trim().replace("#", "");
  const n = parseInt(m.length === 3 ? m.split("").map((c) => c + c).join("") : m, 16);
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
}
