import { projects, type Project } from "../content/projects";

export type { Project, ProjectKind } from "../content/projects";

export function getProjects(): readonly Project[] {
  return projects;
}

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function filterProjects(
  records: readonly Project[],
  query: string,
  category: string,
): Project[] {
  const search = query.trim().toLowerCase();
  const selectedCategory = category.trim().toLowerCase();

  return records.filter((project) => {
    const matchesCategory = !selectedCategory || selectedCategory === "all"
      || project.category.toLowerCase() === selectedCategory;
    const matchesQuery = !search || [project.title, ...project.technologies]
      .some((value) => value.toLowerCase().includes(search));
    return matchesCategory && matchesQuery;
  });
}

export function getNextProject(slug: string): Project | undefined {
  const index = projects.findIndex((project) => project.slug === slug);
  return index === -1 ? undefined : projects[(index + 1) % projects.length];
}
