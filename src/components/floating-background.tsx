"use client";

import { useEffect, useRef } from "react";
import { readEffectsPreference, subscribeEffectsPreference } from "@/lib/effects-preference";
import type { mountFloatingNetwork, NetworkSettings } from "@/lib/floating-network";
import "@/styles/floating-background.css";

export function FloatingBackground() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || typeof window.matchMedia !== "function") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(pointer: fine) and (hover: hover)");
    const compact = window.matchMedia("(max-width: 767px), (pointer: coarse)");
    let controller: ReturnType<typeof mountFloatingNetwork>;
    let disposed = false;
    let loading = false;
    const settings = (): NetworkSettings => ({ animate: !reduced.matches, interactive: !reduced.matches && fine.matches, compact: compact.matches });

    function sync() {
      if (disposed) return;
      const off = readEffectsPreference() === "off";
      canvas!.hidden = off;
      if (off) { controller?.destroy(); controller = undefined; return; }
      if (controller) { controller.update(settings()); return; }
      if (loading) return;
      loading = true;
      void import("@/lib/floating-network").then(({ mountFloatingNetwork }) => {
        if (!disposed && readEffectsPreference() !== "off") controller = mountFloatingNetwork(canvas!, settings());
      }).catch(() => { /* A decorative failure leaves the complete page intact. */ }).finally(() => { loading = false; });
    }

    const stop = subscribeEffectsPreference(sync);
    [reduced, fine, compact].forEach(query => query.addEventListener("change", sync));
    sync();
    return () => {
      disposed = true;
      stop();
      [reduced, fine, compact].forEach(query => query.removeEventListener("change", sync));
      controller?.destroy();
    };
  }, []);
  return <canvas ref={ref} className="floating-network" aria-hidden="true" />;
}
