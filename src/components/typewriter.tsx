"use client";

import { useEffect, useState } from "react";

/** Types each phrase, pauses, deletes it, moves to the next. Static first phrase under reduced motion. */
export function Typewriter({ phrases }: { phrases: string[] }) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState(phrases[0]);
  const [deleting, setDeleting] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const full = phrases[index];
    let delay = deleting ? 28 : 55;
    if (!deleting && text === full) delay = 2200;
    if (deleting && text === full) delay = 2200;

    const id = setTimeout(() => {
      if (deleting) {
        if (text.length === 0) {
          setDeleting(false);
          setIndex((i) => (i + 1) % phrases.length);
        } else {
          setText(text.slice(0, -1));
        }
      } else if (text === full) {
        setDeleting(true);
        setText(text.slice(0, -1));
      } else {
        setText(full.slice(0, text.length + 1));
      }
    }, delay);
    return () => clearTimeout(id);
  }, [text, deleting, index, phrases]);

  return (
    <>
      <span className="sr-only">{phrases.join(", ")}</span>
      <span aria-hidden="true">
        {text}
        <span className="animate-blink ml-0.5 inline-block h-[1em] w-[0.55ch] translate-y-[0.15em] bg-accent" />
      </span>
    </>
  );
}
