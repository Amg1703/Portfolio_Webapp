"use client";

import { useEffect, useRef, useState } from "react";

type Stop = { id: string; label: string };

const RAIL_H = 280; // px

/**
 * Fixed vertical rail on the left edge: one marker per section and a pointer that glides
 * between them in proportion to how far you've scrolled through the current section.
 */
export function ScrollRail({ stops }: { stops: Stop[] }) {
  const pointer = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const tops = stops.map((s) => {
        const el = document.getElementById(s.id);
        return el ? el.getBoundingClientRect().top + window.scrollY : 0;
      });
      const anchor = window.scrollY + window.innerHeight * 0.4;
      const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4;

      let pos: number;
      if (atBottom) pos = stops.length - 1;
      else {
        let i = 0;
        while (i < tops.length - 1 && anchor >= tops[i + 1]) i++;
        const span = i < tops.length - 1 ? tops[i + 1] - tops[i] : 1;
        pos = i + (i < tops.length - 1 ? Math.min(1, Math.max(0, (anchor - tops[i]) / span)) : 0);
      }
      const t = pos / (stops.length - 1);
      if (pointer.current) pointer.current.style.transform = `translate(-50%, ${t * RAIL_H}px) translateY(-50%)`;
      if (fill.current) fill.current.style.height = `${t * RAIL_H}px`;
      setActive(Math.floor(pos + 0.001)); // the section you're in, not the nearest marker
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [stops]);

  return (
    <nav
      aria-label="Page progress"
      className="fixed left-8 top-1/2 z-10 hidden -translate-y-1/2 xl:block"
      style={{ height: RAIL_H }}
    >
      {/* track + gradient fill */}
      <div className="absolute left-0 top-0 h-full w-px -translate-x-1/2 bg-border" />
      <div ref={fill} className="absolute left-0 top-0 w-[2px] -translate-x-1/2 rounded-full bg-gradient-to-b from-accent to-accent-2 transition-[height] duration-150 ease-out" />

      {/* section markers */}
      {stops.map((s, i) => {
        const y = (i / (stops.length - 1)) * RAIL_H;
        const reached = i <= active;
        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            aria-label={s.label}
            aria-current={i === active ? "true" : undefined}
            className="group absolute left-0 flex -translate-x-1/2 -translate-y-1/2 items-center"
            style={{ top: y }}
          >
            <span
              className={`size-2.5 rounded-full border transition-colors ${
                reached ? "border-accent bg-accent" : "border-subtle bg-bg group-hover:border-accent"
              }`}
            />
            <span
              className={`absolute left-5 whitespace-nowrap font-mono text-[11px] uppercase tracking-widest transition-all ${
                i === active
                  ? "translate-x-0 text-accent opacity-100"
                  : "-translate-x-1 text-subtle opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
              }`}
            >
              {String(i).padStart(2, "0")} {s.label}
            </span>
          </a>
        );
      })}

      {/* travelling pointer */}
      <div ref={pointer} aria-hidden="true" className="pointer-events-none absolute left-0 top-0 transition-transform duration-150 ease-out">
        <span className="absolute inset-0 animate-ping rounded-full bg-accent/50" />
        <span className="relative flex size-4 items-center justify-center rounded-full bg-bg shadow-[0_0_18px_var(--accent)] ring-2 ring-accent">
          <span className="size-1.5 rounded-full bg-accent" />
        </span>
      </div>
    </nav>
  );
}
