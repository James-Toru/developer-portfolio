import { profile } from "@/content/profile";
import { getProjects } from "@/lib/projects";
import { CityHero } from "@/components/city-hero";
import { ProjectIndex } from "@/components/project-index";
import { Experience } from "@/components/experience";
import { Contact } from "@/components/contact";
import { Arrow } from "@/components/arrow";
import "@/styles/projects.css";
import "@/styles/sections.css";

export default function HomePage() {
  const featured = getProjects().filter((project) => project.featured);
  return <main id="main-content" tabIndex={-1}>
    <CityHero featured={featured} />
    <ProjectIndex projects={featured} />
    <section id="capabilities" className="capabilities content-section" aria-labelledby="capabilities-title">
      <div className="content-width capability-layout">
        <h2 id="capabilities-title" className="section-title">From interface<br />to orchestration.</h2>
        <dl className="capability-list">
          <div><dt>Web applications</dt><dd>Responsive React and Next.js interfaces, RESTful API integration and role-based systems.</dd></div>
          <div><dt>AI & automation</dt><dd>Supervised multi-agent workflows, human approval gates and governed generative-image pipelines.</dd></div>
          <div><dt>Backend & delivery</dt><dd>Node.js, NestJS, PostgreSQL and MongoDB, with Docker and GitHub Actions.</dd></div>
        </dl>
      </div>
    </section>
    <Experience />
    <section id="about" className="content-section content-width about-section" aria-labelledby="about-title">
      <h2 id="about-title" className="section-title">Built with intention.</h2>
      <div><p className="large-copy">{profile.summary}</p><p className="about-note">My work spans freelance web applications, consulting platforms and supervised AI systems.</p><a className="text-link" href="/james-gatoru-cv.pdf">Download my CV <span className="file-label">(PDF)</span> <Arrow /></a></div>
    </section>
    <Contact />
  </main>;
}
