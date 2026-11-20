"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { playMusic } from "./music";

const LOAD_MS = 3000;
const LAUNCH_MS = 1100;
const LAYERS = 18; // extrusion depth slices for the 3D monogram

/** Extrusion colour: teal just behind the face, shading to deep violet at the back. */
function sliceColor(t: number) {
  const from = [20, 184, 166], to = [76, 29, 149];
  const dim = 1 - t * 0.35;
  const c = from.map((f, k) => Math.round((f + (to[k] - f) * t) * dim));
  return `rgb(${c.join(",")})`;
}

const STATUS = [
  "booting runtime",
  "warming retrieval index",
  "spawning 65 sub-agents",
  "checking guardrails",
  "ready for launch",
];

/**
 * Full-screen intro: a 3D extruded monogram spins in while a progress readout counts up,
 * then the logo rushes the camera and a portal opens onto the site.
 * Visibility is decided before paint by the inline script in layout.tsx (html[data-intro]).
 */
export function IntroLoader({ initials, musicSrc }: { initials: string; musicSrc?: string }) {
  const [phase, setPhase] = useState<"load" | "launch" | "gone">("load");
  const [pct, setPct] = useState(0);
  const launched = useRef(false);

  const launch = useCallback(() => {
    if (launched.current) return;
    launched.current = true;
    setPct(100);
    setPhase("launch");
    const html = document.documentElement;
    // let the portal open a beat before the site starts settling in
    setTimeout(() => (html.dataset.intro = "done"), 250);
    setTimeout(() => setPhase("gone"), LAUNCH_MS);
    try {
      sessionStorage.setItem("intro-seen", "1");
    } catch {}
  }, []);

  useEffect(() => {
    if (document.documentElement.dataset.intro !== "playing") {
      const id = setTimeout(() => setPhase("gone"), 0);
      return () => clearTimeout(id);
    }
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const k = Math.min(1, (now - t0) / LOAD_MS);
      setPct(Math.round((1 - Math.pow(1 - k, 2.2)) * 100));
      if (k < 1) raf = requestAnimationFrame(tick);
      else launch();
    };
    raf = requestAnimationFrame(tick);
    // any click/key skips silently, except on the "launch with music" button itself
    const skip = (e: Event) => {
      if ((e.target as Element | null)?.closest?.("[data-music-launch]")) return;
      launch();
    };
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
  }, [launch]);

  if (phase === "gone") return null;
  const status = STATUS[Math.min(STATUS.length - 1, Math.floor((pct / 100) * STATUS.length))];

  return (
    <div className="intro-overlay" data-phase={phase} role="status" aria-label="Loading">
      <div className="intro-scene">
        <div className="intro-orbit intro-orbit-a" />
        <div className="intro-orbit intro-orbit-b" />
        {/* fade lives on the wrapper: opacity on the 3D element itself would flatten its layers */}
        <div className="intro-logo-wrap">
        <div className="intro-logo" aria-hidden="true">
          {/* deepest slice first, face last, so paint order matches depth even if 3D sorting is unavailable */}
          {Array.from({ length: LAYERS }, (_, n) => LAYERS - 1 - n).map((i) => (
            <span
              key={i}
              className={i === 0 ? "intro-face" : "intro-slice"}
              style={{ transform: `translateZ(${-i * 2.6}px)`, color: i === 0 ? undefined : sliceColor(i / (LAYERS - 1)) }}
            >
              {initials}
            </span>
          ))}
        </div>
        </div>
      </div>

      <div className="intro-readout" aria-hidden="true">
        <div className="flex justify-between font-mono text-[11px] uppercase tracking-[0.25em] text-stone-400">
          <span>{status}…</span>
          <span className="tabular-nums text-[#2dd4bf]">{String(pct).padStart(3, "0")}%</span>
        </div>
        <div className="mt-3 h-px w-full bg-white/10">
          <div className="h-full bg-gradient-to-r from-[#2dd4bf] to-[#a78bfa] shadow-[0_0_12px_#2dd4bf]" style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-stone-600">click or press any key to skip</p>
      </div>

      {musicSrc && (
        <button
          type="button"
          data-music-launch
          onClick={() => {
            playMusic(musicSrc); // the click is the user gesture browsers require for audio
            launch();
          }}
          className="intro-music group flex items-center gap-3 rounded-full border border-[#2dd4bf]/40 bg-white/[0.03] px-5 py-2.5 font-mono text-xs uppercase tracking-[0.2em] text-stone-200 shadow-[0_0_24px_rgba(45,212,191,0.15)] backdrop-blur transition-all hover:border-[#2dd4bf] hover:text-[#2dd4bf] hover:shadow-[0_0_32px_rgba(45,212,191,0.35)]"
        >
          <span aria-hidden="true" className="flex h-3 items-end gap-[2px]">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className="animate-eq w-[2px] rounded-full bg-[#2dd4bf]" style={{ animationDelay: `${i * -0.22}s` }} />
            ))}
          </span>
          launch with music
        </button>
      )}
    </div>
  );
}
