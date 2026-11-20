"use client";

import { useSyncExternalStore } from "react";
import { isMusicPlaying, pauseMusic, playMusic, subscribeMusic } from "./music";

/** Header toggle for the shared background-music player; shows animated bars while playing. */
export function MusicToggle({ src }: { src: string }) {
  const playing = useSyncExternalStore(subscribeMusic, isMusicPlaying, () => false);

  return (
    <button
      type="button"
      onClick={() => (playing ? pauseMusic() : playMusic(src))}
      aria-pressed={playing}
      aria-label={playing ? "Pause background music" : "Play background music"}
      className="flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1.5 text-muted transition-colors hover:border-accent hover:text-accent"
    >
      <span aria-hidden="true" className="flex h-3 items-end gap-[2px]">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={`w-[2px] rounded-full bg-accent ${playing ? "animate-eq" : ["h-1.5", "h-3", "h-1", "h-2"][i]}`}
            style={playing ? { animationDelay: `${i * -0.22}s` } : undefined}
          />
        ))}
      </span>
      <span className="hidden sm:inline">{playing ? "music on" : "music off"}</span>
    </button>
  );
}
