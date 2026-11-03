"use client";

import { useEffect } from "react";

export function SiteMotion() {
  useEffect(() => {
    if (typeof window.matchMedia !== "function" || typeof IntersectionObserver === "undefined") return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const seen = new WeakSet<Element>();
    const animated = new Set<HTMLElement>();
    let observer: IntersectionObserver | undefined;
    let active = true;

    function observeIntroductions() {
      observer?.disconnect();
      if (preference.matches) {
        animated.forEach(target => target.classList.remove("motion-enter"));
        return;
      }
      const remaining = new Set([...document.querySelectorAll<HTMLElement>(".section-title, .archive-heading, .project-heading, .selected-copy")].filter(target => !seen.has(target)));
      if (!remaining.size) return;
      const current: IntersectionObserver = new IntersectionObserver(entries => {
        if (!active || preference.matches || observer !== current) return;
        for (const entry of entries) {
          if (!entry.isIntersecting || !remaining.has(entry.target as HTMLElement)) continue;
          const target = entry.target as HTMLElement;
          target.classList.add("motion-enter");
          animated.add(target);
          seen.add(target);
          remaining.delete(target);
          current.unobserve(target);
        }
        if (!remaining.size) current.disconnect();
      }, { threshold: .15, rootMargin: "0px 0px -24px 0px" });
      observer = current;
      remaining.forEach(target => current.observe(target));
    }

    observeIntroductions();
    preference.addEventListener?.("change", observeIntroductions);
    return () => {
      active = false;
      observer?.disconnect();
      preference.removeEventListener?.("change", observeIntroductions);
      animated.forEach(target => target.classList.remove("motion-enter"));
    };
  }, []);
  return null;
}
