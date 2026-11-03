import type { Metadata } from "next";
import { getProjects } from "@/lib/projects";
import { ProjectArchive } from "@/components/project-archive";
import { Contact } from "@/components/contact";
import "@/styles/projects.css";

export const metadata: Metadata = { title: "Work", description: "Explore James Gatoru’s selected web applications, legal and case-management platforms, websites and AI workflows." };

export default function WorkPage() {
  return <main id="main-content" tabIndex={-1}>
    <div className="content-width archive-page"><header className="archive-heading"><h1>Work, in full.</h1><p className="large-copy">Web applications, AI workflows and websites. A curated collection of professional work and independent projects.</p></header><ProjectArchive projects={getProjects()} /></div>
    <Contact />
  </main>;
}
