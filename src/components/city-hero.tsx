import type { Project } from "@/lib/projects";
import { projectArt } from "@/content/project-art";
import { Arrow } from "./arrow";
import "@/styles/hero.css";

export function CityHero({ featured }: { featured: readonly Project[] }) {
  return <section className="hero" aria-labelledby="hero-title">
    <picture className="hero-art" aria-hidden="true">
      <source media="(max-width: 767px)" srcSet="/art/city-mobile.avif" type="image/avif" />
      <source media="(max-width: 767px)" srcSet="/art/city-mobile.webp" type="image/webp" />
      <source srcSet="/art/city-desktop.avif" type="image/avif" />
      <img src="/art/city-desktop.webp" width="1536" height="1024" alt="" fetchPriority="high" />
    </picture>
    <div className="hero-layout content-width">
      <div className="hero-intro">
        <h1 id="hero-title"><span>James</span><span>Gatoru</span></h1>
        <p className="hero-role"><span aria-hidden="true">//</span> Software Developer <span className="role-divider" aria-hidden="true">/</span> <span>AI Agentic Engineer</span></p>
        <p className="hero-description">Full-stack platforms. Agentic workflows. Thoughtful design.</p>
        <div className="hero-actions">
          <a className="button button-primary" href="#work">Explore my work <Arrow /></a>
          <a className="button button-outline" href="#contact">Let’s talk <Arrow /></a>
        </div>
        <div className="hero-effects-slot" />
      </div>
      <nav className="hero-index" aria-label="Featured work">
        <p className="illustration-note">Illustrative project visuals</p>
        {featured.map((project, index) => {
          const art = projectArt[project.slug];
          return <a href={`#${project.slug}`} className="index-link" key={project.slug}>
            <span className="index-number" aria-hidden="true">0{index + 1} /</span>
            <span>{project.slug === "agentic-workflows" ? "Agentic Workflows" : project.title}</span>
            {art && <picture className="index-art"><source srcSet={`${art.src}.avif`} type="image/avif" /><img src={`${art.src}.webp`} width={art.width} height={art.height} alt="" loading="lazy" /></picture>}
            <Arrow />
          </a>;
        })}
      </nav>
    </div>
  </section>;
}
