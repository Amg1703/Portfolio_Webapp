"use client";

import { useEffect, useState } from "react";

type Item = { id: string; label: string; icon: React.ReactNode };

const s = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as const;

const items: Item[] = [
  { id: "top", label: "Home", icon: <svg viewBox="0 0 24 24" {...s}><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1Z" /></svg> },
  { id: "skills", label: "Skills", icon: <svg viewBox="0 0 24 24" {...s}><path d="m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5" /></svg> },
  { id: "about", label: "About", icon: <svg viewBox="0 0 24 24" {...s}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg> },
  { id: "experience", label: "Experience", icon: <svg viewBox="0 0 24 24" {...s}><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18" /></svg> },
  { id: "projects", label: "Projects", icon: <svg viewBox="0 0 24 24" {...s}><path d="m12 3 2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6-4.5-4.2 6.1-.7Z" /></svg> },
  { id: "contact", label: "Contact", icon: <svg viewBox="0 0 24 24" {...s}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg> },
];

/** Floating bottom navigation that highlights the section currently in view. */
export function Dock({ resume }: { resume: string }) {
  const [active, setActive] = useState("top");

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5] },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);

  return (
    <nav
      aria-label="Sections"
      className="fixed inset-x-0 bottom-[max(1rem,env(safe-area-inset-bottom))] z-20 mx-auto flex w-fit items-center gap-0.5 rounded-2xl border border-accent/30 bg-surface/70 p-1.5 shadow-xl shadow-accent/10 ring-1 ring-accent-2/20 ring-offset-0 backdrop-blur-xl sm:bottom-6 sm:gap-1"
    >
      {items.map((it) => (
        <a
          key={it.id}
          href={`#${it.id}`}
          aria-label={it.label}
          aria-current={active === it.id ? "true" : undefined}
          className={`group relative flex size-9 items-center justify-center rounded-xl sm:size-10 transition-all [&>svg]:size-[18px] ${
            active === it.id ? "bg-accent-soft text-accent" : "text-muted hover:-translate-y-1 hover:bg-bg hover:text-fg"
          }`}
        >
          {it.icon}
          <span className="pointer-events-none absolute -top-9 rounded-md border border-border bg-surface px-2 py-1 font-mono text-[11px] text-fg opacity-0 transition-opacity group-hover:opacity-100">
            {it.label}
          </span>
        </a>
      ))}
      <span className="mx-1 h-6 w-px bg-border" />
      <a
        href={resume}
        download
        aria-label="Download resume"
        className="group relative flex h-9 items-center rounded-xl bg-fg px-2.5 font-mono sm:h-10 sm:px-3 text-xs font-medium text-bg transition-opacity hover:opacity-85"
      >
        CV
      </a>
    </nav>
  );
}
