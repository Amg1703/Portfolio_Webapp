"use client";

import { useEffect, useRef } from "react";

/**
 * Drop inside a `relative` wrapper around a timeline <ol>. Draws a gradient fill and a glowing
 * pointer that travel down the timeline as the page scrolls, and marks each <li> the pointer has
 * passed with data-reached="true" (style milestones with group-data-[reached=true]).
 */
export function TimelineProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    const wrap = root?.parentElement;
    if (!root || !wrap) return;
    const items = [...wrap.querySelectorAll<HTMLElement>(":scope > ol > li")];
    let raf = 0;

    const update = () => {
      raf = 0;
      const r = wrap.getBoundingClientRect();
      const anchor = window.innerHeight * 0.45;
      const p = Math.min(1, Math.max(0, (anchor - r.top) / r.height));
      root.style.setProperty("--p", String(p));
      const y = p * r.height;
      for (const li of items) li.dataset.reached = String(li.offsetTop + 10 <= y);
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
  }, []);

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 [--p:0]">
      <div className="absolute left-[-0.5px] top-0 h-[calc(var(--p)*100%)] w-[2px] rounded-full bg-gradient-to-b from-accent to-accent-2" />
      <div className="absolute left-0 top-[calc(var(--p)*100%)] -translate-x-1/2 -translate-y-1/2">
        <span className="absolute inset-0 animate-ping rounded-full bg-accent/50" />
        <span className="relative flex size-4 items-center justify-center rounded-full bg-bg shadow-[0_0_18px_var(--accent)] ring-2 ring-accent">
          <span className="size-1.5 rounded-full bg-accent" />
        </span>
      </div>
    </div>
  );
}
