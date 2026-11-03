"use client";

import { useEffect } from "react";
import { readEffectsPreference, subscribeEffectsPreference } from "@/lib/effects-preference";
import { startSlideMotion } from "@/lib/slide-motion";

export function SiteMotion() {
  useEffect(() => {
    if (typeof window.matchMedia !== "function" || typeof IntersectionObserver === "undefined") return;
    const targets = [...document.querySelectorAll<HTMLElement>(".skills-group, .career-stop-current, #hero-title")];
    if (!targets.length) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const visible = new Set<Element>();
    let active = true;

    function syncSignals() {
      if (!active) return;
      const enabled = !document.hidden && !reduced.matches && readEffectsPreference() !== "off";
      targets.forEach(target => target.classList.toggle("signal-active", enabled && visible.has(target)));
    }

    const observer = new IntersectionObserver(entries => {
      if (!active) return;
      entries.forEach(entry => {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      });
      syncSignals();
    });
    targets.forEach(target => observer.observe(target));
    const unsubscribe = subscribeEffectsPreference(syncSignals);
    reduced.addEventListener?.("change", syncSignals);
    document.addEventListener("visibilitychange", syncSignals);
    return () => {
      active = false;
      observer.disconnect();
      unsubscribe();
      reduced.removeEventListener?.("change", syncSignals);
      document.removeEventListener("visibilitychange", syncSignals);
      targets.forEach(target => target.classList.remove("signal-active"));
    };
  }, []);

  useEffect(() => startSlideMotion(), []);
  return null;
}
