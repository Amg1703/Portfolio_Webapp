"use client";

import { useSyncExternalStore } from "react";

const fmt = new Intl.DateTimeFormat("en-AU", {
  timeZone: "Australia/Sydney",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

function subscribe(cb: () => void) {
  const id = setInterval(cb, 1000);
  return () => clearInterval(id);
}

/** Current time in Sydney, ticking every second. Renders a placeholder on the server. */
export function LiveClock() {
  const time = useSyncExternalStore(
    subscribe,
    () => fmt.format(new Date()),
    () => "--:--:--",
  );
  return (
    <time className="tabular-nums" suppressHydrationWarning>
      {time}
    </time>
  );
}
