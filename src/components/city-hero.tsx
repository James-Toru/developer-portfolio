"use client";

import { useEffect, useRef, useState } from "react";
import type { Project } from "@/lib/projects";
import { resolveEffectsPolicy, type EffectsPreference } from "@/lib/effects-policy";
import type { HeroEffectsController } from "@/lib/hero-effects";
import { projectArt } from "@/content/project-art";
import { Arrow } from "./arrow";
import { EffectsControl } from "./effects-control";
import { ProjectPicture } from "./project-media";
import "@/styles/hero.css";

export function CityHero({ featured }: { featured: readonly Project[] }) {
  const rootRef = useRef<HTMLElement>(null);
  const [preference, setPreference] = useState<EffectsPreference | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || preference === null || !window.matchMedia) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(pointer: fine)");
    const hover = window.matchMedia("(hover: hover)");
    let visible = !window.IntersectionObserver;
    let disposed = false;
    let loading = false;
    let controller: HeroEffectsController | undefined;

    function policy() {
      const resolved = resolveEffectsPolicy({
        preference: preference!, reducedMotion: reduced.matches,
        finePointer: fine.matches, hover: hover.matches,
        visible, documentVisible: !document.hidden,
      });
      // The owner requested a stationary city. Auto may animate rain only.
      return { ambient: resolved.ambient, pointer: false };
    }

    function sync() {
      if (disposed) return;
      const next = policy();
      controller?.updatePolicy(next);
      // Touch retains the baked-in rain. Load the enhancement only when useful.
      if (controller || loading || !next.ambient || !fine.matches || !hover.matches) return;
      loading = true;
      void import("@/lib/hero-effects").then(({ mountHeroEffects }) => {
        if (!disposed) controller = mountHeroEffects(root!, [], policy());
      }).catch(() => {
        // A failed decorative chunk must leave the complete static hero usable.
        loading = false;
      });
    }

    const observer = window.IntersectionObserver ? new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    }) : undefined;
    observer?.observe(root);
    [reduced, fine, hover].forEach((query) => query.addEventListener("change", sync));
    document.addEventListener("visibilitychange", sync);
    sync();

    return () => {
      disposed = true;
      observer?.disconnect();
      [reduced, fine, hover].forEach((query) => query.removeEventListener("change", sync));
      document.removeEventListener("visibilitychange", sync);
      controller?.destroy();
    };
  }, [preference]);

  return <section ref={rootRef} className="hero" aria-labelledby="hero-title">
    <picture className="hero-art" aria-hidden="true">
      <source media="(max-width: 767px)" srcSet="/art/city-mobile.avif" type="image/avif" />
      <source media="(max-width: 767px)" srcSet="/art/city-mobile.webp" type="image/webp" />
      <source srcSet="/art/city-desktop.avif" type="image/avif" />
      <img src="/art/city-desktop.webp" width="1536" height="1024" alt="" fetchPriority="high" />
    </picture>
    <div className="hero-atmosphere" aria-hidden="true"><span className="hero-rain" /></div>
    <div className="hero-layout content-width">
      <div className="hero-intro">
        <h1 id="hero-title"><span>James<span className="name-glitch" aria-hidden="true" data-text="James" /></span><span>Gatoru<span className="name-glitch" aria-hidden="true" data-text="Gatoru" /></span></h1>
        <p className="hero-role"><span aria-hidden="true">//</span> Software Developer <span className="role-divider" aria-hidden="true">/</span> <span>AI Agentic Engineer</span></p>
        <p className="hero-description">Full-stack platforms. Agentic workflows. Thoughtful design.</p>
        <div className="hero-actions">
          <a className="button button-primary" href="#work">Explore my work <Arrow /></a>
          <a className="button button-outline" href="#contact">Let’s talk <Arrow /></a>
        </div>
        <div className="hero-effects-slot"><EffectsControl onChange={setPreference} /></div>
      </div>
      <nav className="hero-index" aria-label="Featured work">
        <p className="illustration-note">Project previews & covers</p>
        {featured.slice(0, 3).map((project, index) => {
          const art = projectArt[project.slug];
          return <a href={`#${project.slug}`} className="index-link" key={project.slug}>
            <span className="index-number" aria-hidden="true">0{index + 1} /</span>
            <span>{project.slug === "agentic-workflows" ? "Agentic Workflows" : project.title}</span>
            {art && <span className="index-art"><ProjectPicture art={art} decorative /></span>}
            <Arrow />
          </a>;
        })}
      </nav>
    </div>
  </section>;
}
