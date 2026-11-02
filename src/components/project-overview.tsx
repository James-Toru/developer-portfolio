import type { Project } from "@/lib/projects";
import { profile } from "@/content/profile";
import { projectArt } from "@/content/project-art";
import { Arrow } from "./arrow";

export function ProjectOverview({ project, next }: { project: Project; next?: Project }) {
  const art = projectArt[project.slug];
  const kindLabel = project.kind === "fork" ? "Fork" : project.kind === "supporting" ? "Supporting repository" : project.kind === "experiment" ? "Experiment / study" : project.kind === "professional" ? "Professional work" : "Independent project";
  return <article className="project-overview content-width">
    <a className="text-link back-link" href="/work/">Back to work</a>
    <header className="project-heading"><h1>{project.title}</h1><p className="project-classification">{project.category} <span aria-hidden="true">/</span> {kindLabel}</p></header>
    <div className="overview-layout">
      <div className="overview-copy"><p className="large-copy">{project.summary}</p>
        {project.context && <section className="overview-section" aria-labelledby="context-title"><h2 id="context-title">Context</h2><p>{project.context}</p></section>}
        {project.contribution && <section className="overview-section" aria-labelledby="contribution-title"><h2 id="contribution-title">Contribution</h2><p>{project.contribution}</p></section>}
      </div>
      <div className="project-facts">
        {project.organization && <div><h2>Organization</h2><p>{project.organization}</p></div>}
        {project.technologies.length > 0 && <div><h2>Technologies</h2><ul className="technology-list">{project.technologies.map((technology) => <li key={technology}>{technology}</li>)}</ul></div>}
        {(project.repository || project.demo) && <div><h2>Explore</h2><div className="project-external-links">{project.repository && <a className="text-link" href={project.repository}>View repository <Arrow /></a>}{project.demo && <a className="text-link" href={project.demo}>Visit website <Arrow /></a>}</div></div>}
      </div>
    </div>
    {art && <figure className="project-plate overview-plate"><picture><source srcSet={`${art.src}.avif`} type="image/avif" /><img src={`${art.src}.webp`} width={art.width} height={art.height} alt={art.label} /></picture><figcaption>Illustrative visual — {art.label.toLowerCase()}.</figcaption></figure>}
    <div className="project-close"><div><h2>Have a project in mind?</h2><a className="text-link" href={`mailto:${profile.email}`}>Let’s talk <Arrow /></a></div>{next && <a className="next-project" href={`/work/${next.slug}/`}><span>Next project</span><strong>{next.title}</strong><Arrow /></a>}</div>
  </article>;
}
