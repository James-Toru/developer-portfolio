import type { Project } from "@/lib/projects";
import { projectArt } from "@/content/project-art";
import { Arrow } from "./arrow";

export function ProjectIndex({ projects }: { projects: readonly Project[] }) {
  return <section id="work" className="content-section content-width" aria-labelledby="work-title">
    <div className="section-heading"><h2 id="work-title" className="section-title">Selected work</h2><a className="text-link" href="/work/">View all projects <Arrow /></a></div>
    <div className="selected-work">
      {projects.map((project) => {
        const art = projectArt[project.slug];
        return <article id={project.slug} className="selected-project" key={project.slug}>
          {art && <figure className="project-plate"><picture><source srcSet={`${art.src}.avif`} type="image/avif" /><img src={`${art.src}.webp`} width={art.width} height={art.height} alt={art.label} loading="lazy" /></picture><figcaption>Illustrative visual</figcaption></figure>}
          <div className="selected-copy"><h3><a href={`/work/${project.slug}/`}>{project.title}</a></h3><p className="category">{project.category}{project.organization && <span> / {project.organization}</span>}</p><p className="project-summary">{project.summary}</p>
            {project.technologies.length > 0 && <p className="technology-line">{project.technologies.join(" · ")}</p>}
            <a className="text-link" href={`/work/${project.slug}/`}>Explore project <Arrow /></a>
          </div>
        </article>;
      })}
    </div>
  </section>;
}
