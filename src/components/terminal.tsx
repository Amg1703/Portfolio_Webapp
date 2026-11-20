"use client";

import { useEffect, useState } from "react";

export type TerminalStep = { cmd: string; out: string[] };

/**
 * A fake shell that types each command, then prints its output.
 * The full transcript is in an sr-only block; the animated copy is aria-hidden.
 */
export function Terminal({ steps }: { steps: TerminalStep[] }) {
  // step = how many commands are fully done; chars = progress through the current command
  const [step, setStep] = useState(0);
  const [chars, setChars] = useState(0);
  const [started, setStarted] = useState(false);

  // Hold off typing until the intro overlay has launched, so visitors actually see it
  useEffect(() => {
    const html = document.documentElement;
    const check = () => {
      if (html.dataset.intro !== "playing") setStarted(true);
    };
    const id = setTimeout(check, 0);
    const mo = new MutationObserver(check);
    mo.observe(html, { attributes: true, attributeFilter: ["data-intro"] });
    return () => {
      clearTimeout(id);
      mo.disconnect();
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = setTimeout(() => setStep(steps.length), 0);
      return () => clearTimeout(id);
    }
    if (!started || step >= steps.length) return;
    const cmd = steps[step].cmd;
    const id =
      chars < cmd.length
        ? setTimeout(() => setChars((c) => c + 1), 45 + Math.random() * 60)
        : setTimeout(() => {
            setStep((s) => s + 1);
            setChars(0);
          }, 450);
    return () => clearTimeout(id);
  }, [step, chars, steps, started]);

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-[#0b0f0e]/95 font-mono text-[13px] leading-relaxed text-stone-300 shadow-2xl shadow-accent/10 backdrop-blur">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <span className="size-3 rounded-full bg-[#ff5f57]" />
        <span className="size-3 rounded-full bg-[#febc2e]" />
        <span className="size-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 text-xs text-stone-500">arjun@sydney: ~</span>
      </div>

      <div className="sr-only">
        {steps.map((s) => (
          <div key={s.cmd}>
            <p>$ {s.cmd}</p>
            {s.out.map((o) => (
              <p key={o}>{o}</p>
            ))}
          </div>
        ))}
      </div>

      <div aria-hidden="true" className="min-h-[300px] space-y-3 p-5">
        {steps.slice(0, Math.min(step + 1, steps.length)).map((s, i) => {
          const done = i < step;
          return (
            <div key={s.cmd}>
              <p>
                <span className="text-[#2dd4bf]">❯</span> {done ? s.cmd : s.cmd.slice(0, chars)}
                {!done && <Cursor />}
              </p>
              {done &&
                s.out.map((o) => (
                  <p key={o} className="text-stone-400">
                    {o}
                  </p>
                ))}
            </div>
          );
        })}
        {step >= steps.length && (
          <p>
            <span className="text-[#2dd4bf]">❯</span> <Cursor />
          </p>
        )}
      </div>
    </div>
  );
}

function Cursor() {
  return <span className="animate-blink ml-0.5 inline-block h-[1.1em] w-[0.6ch] translate-y-[0.2em] bg-[#2dd4bf]" />;
}
