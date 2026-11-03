"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import type { EffectsPreference } from "@/lib/effects-policy";
import { readEffectsPreference, setEffectsPreference, subscribeEffectsPreference } from "@/lib/effects-preference";
import "@/styles/effects-control.css";

export function EffectsControl({ onChange }: { onChange?(preference: EffectsPreference): void }) {
  const preference = useSyncExternalStore<EffectsPreference>(subscribeEffectsPreference, readEffectsPreference, () => "auto");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
    onChange?.(preference);
  }, [onChange, preference]);

  return <div className="effects-control" role="group" aria-label="Effects: Auto respects reduced motion">
    <span className="effects-label">Effects</span>
    {(["auto", "off"] as const).map((value) => <button
      key={value}
      type="button"
      aria-pressed={preference === value}
      disabled={!ready}
      onClick={() => setEffectsPreference(value)}
    >{value === "auto" ? "Auto" : "Off"}</button>)}
  </div>;
}
