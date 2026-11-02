"use client";

import { useEffect, useState } from "react";
import type { EffectsPreference } from "@/lib/effects-policy";

const storageKey = "midnight-network:effects";

export function EffectsControl({ onChange }: { onChange(preference: EffectsPreference): void }) {
  const [preference, setPreference] = useState<EffectsPreference>("auto");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let saved: EffectsPreference = "auto";
    try {
      if (window.localStorage.getItem(storageKey) === "off") saved = "off";
    } catch {
      // Storage can be blocked; the current visit still has working controls.
    }
    setPreference(saved);
    setReady(true);
    onChange(saved);
  }, [onChange]);

  function choose(next: EffectsPreference) {
    setPreference(next);
    onChange(next);
    try {
      window.localStorage.setItem(storageKey, next);
    } catch {
      // Keep the user's in-memory selection when persistence is unavailable.
    }
  }

  return <div className="effects-control" role="group" aria-label="Effects: Auto respects reduced motion">
    <span className="effects-label">Effects</span>
    {(["auto", "off"] as const).map((value) => <button
      key={value}
      type="button"
      aria-pressed={preference === value}
      disabled={!ready}
      onClick={() => choose(value)}
    >{value === "auto" ? "Auto" : "Off"}</button>)}
  </div>;
}
