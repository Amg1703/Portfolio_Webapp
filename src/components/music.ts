"use client";

// One shared background-music player, used by the intro's "launch with music" button and the header toggle.

const TARGET_VOLUME = 0.35;
const FADE_MS = 900;

let audio: HTMLAudioElement | null = null;
let playing = false;
let fadeRaf = 0;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function get(src: string) {
  if (!audio) {
    audio = new Audio(src);
    audio.loop = true;
    audio.preload = "none";
    audio.volume = 0;
  }
  return audio;
}

function rampTo(a: HTMLAudioElement, target: number, then?: () => void) {
  cancelAnimationFrame(fadeRaf);
  const start = a.volume, t0 = performance.now();
  const step = (now: number) => {
    const k = Math.min(1, (now - t0) / FADE_MS);
    a.volume = start + (target - start) * k;
    if (k < 1) fadeRaf = requestAnimationFrame(step);
    else then?.();
  };
  fadeRaf = requestAnimationFrame(step);
}

export async function playMusic(src: string) {
  const a = get(src);
  try {
    await a.play();
    playing = true;
    emit();
    rampTo(a, TARGET_VOLUME);
  } catch {
    playing = false;
    emit();
  }
}

export function pauseMusic() {
  if (!audio) return;
  const a = audio;
  playing = false;
  emit();
  rampTo(a, 0, () => a.pause());
}

export function subscribeMusic(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export const isMusicPlaying = () => playing;
