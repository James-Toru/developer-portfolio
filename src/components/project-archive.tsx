"use client";

import { useState, useSyncExternalStore } from "react";
import { projectCategories } from "@/content/projects";
import { filterProjects, type Project } from "@/lib/projects";
import { Arrow } from "./arrow";
import { projectArt } from "@/content/project-art";
import { ProjectMedia } from "./project-media";

const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;
const kindLabels = { professional: "Professional work", personal: "Independent project", experiment: "Experiment / study", fork: "Fork", supporting: "Supporting repository" };

function ArchiveRows({ projects }: { projects: readonly Project[] }) {
  return <div className="archive-rows">{projects.map((project) => <article className="archive-row" key={project.slug}>
    <div className="archive-name">{projectArt[project.slug] && <ProjectMedia art={projectArt[project.slug]} className="archive-preview" />}<h3><a href={`/work/${project.slug}/`}>{project.title}<Arrow /></a></h3><p className="archive-kind">{kindLabels[project.kind]}</p></div>
    <div className="archive-description"><p>{project.summary}</p>{project.technologies.length > 0 && <p className="technology-line">{project.technologies.join(" · ")}</p>}</div>
    <p className="archive-category">{project.category}</p>
  </article>)}</div>;
}

export function ProjectArchive({ projects }: { projects: readonly Project[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const enhanced = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);
  const filtered = filterProjects(projects, query, category);
  const hasFilters = query.trim() !== "" || category !== "all";
  function reset() { setQuery(""); setCategory("all"); }

  return <div className="project-archive">
    <fieldset className="archive-filters" disabled={!enhanced}>
      <legend className="sr-only">Filter projects</legend>
      <label htmlFor="project-search">Search by project or technology</label>
      <input id="project-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try Next.js or LawPro360" autoComplete="off" />
      <div className="category-filters" role="group" aria-label="Project category">
        {["all", ...projectCategories].map((item) => <button type="button" key={item} aria-pressed={category === item} onClick={() => setCategory(item)}>{item === "all" ? "All work" : item}</button>)}
      </div>
    </fieldset>
    <noscript><p className="archive-note">You’re viewing all projects. Search and category filters are available with JavaScript enabled.</p></noscript>
    <div className="archive-results"><p role="status" aria-live="polite" aria-atomic="true">{filtered.length} of {projects.length} projects</p>{hasFilters && <button type="button" className="reset-filters" onClick={reset}>Reset filters</button>}</div>
    {filtered.length === 0 && <div className="archive-empty"><h2>No matching projects</h2><p>Try another title or technology, choose a different category, or reset the filters to see everything.</p></div>}
    <section aria-labelledby="archive-projects-title"><h2 id="archive-projects-title" className="archive-section-title">Projects & experiments</h2>{filtered.length > 0 && <ArchiveRows projects={filtered} />}</section>
  </div>;
}
