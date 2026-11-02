import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { projectArt } from "@/content/project-art";

function Arrow() {
  return <svg className="arrow-icon" width="28" height="24" viewBox="0 0 28 24" fill="none" aria-hidden="true"><path d="M2 12h23M17 4l8 8-8 8" stroke="currentColor" strokeWidth="2" /></svg>;
}

export default function HomePage() {
  const featured = projects.filter((project) => project.featured);
  return (
    <main id="main-content" tabIndex={-1}>
      <section className="hero" aria-labelledby="hero-title">
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
            </a>;})}
          </nav>
        </div>
      </section>
      <section id="work" className="content-section content-width" aria-labelledby="work-title">
        <h2 id="work-title" className="section-title">Selected work</h2>
        <div className="work-list">
          {featured.map((project) => <article id={project.slug} className="work-row" key={project.slug}>
            <div><h3>{project.title}</h3><p className="category">{project.category}</p></div>
            <p>{project.summary}</p>
          </article>)}
        </div>
      </section>
      <section id="about" className="content-section content-width about-section" aria-labelledby="about-title">
        <h2 id="about-title" className="section-title">Built with intention.</h2>
        <div><p className="large-copy">{profile.summary}</p><a className="text-link" href="/james-gatoru-cv.pdf">Download my CV <span className="file-label">(PDF)</span> <Arrow /></a></div>
      </section>
      <section id="experience" className="content-section content-width" aria-labelledby="experience-title">
        <h2 id="experience-title" className="section-title">Experience</h2>
        <div className="experience-list">{profile.experience.map((item) => <article className="experience-row" key={item.organization}>
          <p className="experience-period">{item.period}</p><div><h3>{item.role}</h3><p className="organization">{item.organization}</p><p>{item.summary}</p></div>
        </article>)}</div>
      </section>
      <section id="contact" className="contact-band" aria-labelledby="contact-title">
        <div className="content-width"><h2 id="contact-title">Let’s build something.</h2><a className="contact-email" href={`mailto:${profile.email}`}>{profile.email}<Arrow /></a><div className="social-links">{profile.socialLinks.map((link) => <a href={link.href} key={link.label}>{link.label}<Arrow /></a>)}</div></div>
      </section>
    </main>
  );
}
