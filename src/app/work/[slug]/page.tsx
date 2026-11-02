import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProject, getProjects, getNextProject } from "@/lib/projects";
import { ProjectOverview } from "@/components/project-overview";
import "@/styles/projects.css";

export const dynamicParams = false;
export function generateStaticParams() { return getProjects().map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) notFound();
  return { title: project.title, description: project.summary };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const project = getProject((await params).slug);
  if (!project) notFound();
  return <main id="main-content" tabIndex={-1}><ProjectOverview project={project} next={getNextProject(project.slug)} /></main>;
}
