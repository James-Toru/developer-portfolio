import type { Metadata } from "next";
import { getProjects } from "@/lib/projects";
import { ProjectArchive } from "@/components/project-archive";
import { Contact } from "@/components/contact";
import "@/styles/projects.css";

export const metadata: Metadata = { title: "Work", description: "Explore James Gatoru’s web applications, AI workflows, websites and experiments, with supporting repositories and forks clearly identified." };

export default function WorkPage() {
  return <main id="main-content" tabIndex={-1}>
    <div className="content-width archive-page"><header className="archive-heading"><h1>Work, in full.</h1><p className="large-copy">Web applications, AI workflows and experiments. A complete collection of professional work and public repositories.</p></header><ProjectArchive projects={getProjects()} /></div>
    <Contact />
  </main>;
}
