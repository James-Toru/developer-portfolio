"use client";

import { useEffect, useRef, useState } from "react";
import "@/styles/back-to-top.css";

const perimeter = "M13 1H55V51L43 63H1V13Z";

export function BackToTop() {
  const progress = useRef<SVGPathElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    let frame: number | null = null;
    let shown = false;
    let active = true;
    function measure() {
      frame = null;
      const distance = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      const y = Math.max(0, window.scrollY);
      const amount = Math.min(1, y / Math.max(1, distance));
      if (progress.current) progress.current.style.strokeDashoffset = String((1 - amount) * 100);
      const next = distance > 0 && y > Math.max(400, window.innerHeight * .65);
      if (next !== shown) { shown = next; setVisible(next); }
    }
    function queue() { if (active && frame === null) frame = requestAnimationFrame(measure); }
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue, { passive: true });
    const observer = typeof ResizeObserver === "function" ? new ResizeObserver(queue) : undefined;
    observer?.observe(document.body);
    queue();
    return () => {
      active = false;
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
      observer?.disconnect();
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  function returnToTop() {
    const reduced = typeof window.matchMedia !== "function" || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById("main-content")?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: reduced ? "instant" : "smooth" });
  }

  return <button className="back-to-top" type="button" aria-label="Back to top" title="Back to top" data-visible={visible} disabled={!visible} onClick={returnToTop}>
    <svg viewBox="0 0 56 64" width="56" height="64" fill="none" aria-hidden="true">
      <path className="return-frame" d={perimeter} />
      <path ref={progress} className="return-progress" d={perimeter} pathLength="100" strokeDasharray="100" strokeDashoffset="100" />
      <path className="return-arrow" d="m20 28 8-8 8 8M28 21v18" />
    </svg>
    <span aria-hidden="true">Top</span>
  </button>;
}
