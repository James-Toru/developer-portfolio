import { describe, expect, it } from "vitest";
import inventory from "../../docs/research/project-sources.json";
import { profile } from "../content/profile";
import { filterProjects, getNextProject, getProject, getProjects } from "./projects";

describe("source-backed archive", () => {
  it("preserves all 13 CV records and all 17 repository references in 28 unique entries", () => {
    const projects = getProjects();
    expect(projects).toHaveLength(28);
    expect(new Set(projects.map(({ slug }) => slug)).size).toBe(28);
    for (const source of inventory.cvProjects) {
      expect(projects.find(({ slug }) => slug === source.id), source.id).toBeDefined();
    }
    for (const source of inventory.publicRepositories) {
      expect(projects.filter(({ repository }) => repository === source.url), source.name).toHaveLength(1);
    }
  });

  it("merges only Lugawa and Texplore while keeping public AI work separate from TYTOS", () => {
    const withRepository = inventory.cvProjects.filter(({ id }) => getProject(id)?.repository);
    expect(withRepository.map(({ id }) => id).sort()).toEqual(["lugawa", "texplore"]);
    expect(getProject("lugawa")).toMatchObject({ organization: "Freelance", repository: "https://github.com/James-Toru/Lugawa" });
    expect(getProject("texplore")).toMatchObject({ organization: "Freelance", repository: "https://github.com/James-Toru/texplore" });
    expect(getProject("agentic-workflows")).toMatchObject({ organization: "TYTOS GmbH", kind: "professional" });
    expect(getProject("agentic-workflows")?.repository).toBeUndefined();
    expect(getProject("agent-pipeline-foundry")?.organization).toBeUndefined();
  });

  it("labels the upstream fork and supporting repositories explicitly", () => {
    expect(getProject("chatgpt-vscode")?.kind).toBe("fork");
    expect(getProject("james-toru")?.kind).toBe("supporting");
    expect(getProject("uml-diagrams")?.kind).toBe("supporting");
    expect(getProject("github-agent-workflow-test")?.kind).toBe("experiment");
    expect(getProject("ics2409-neural-networks-assignment")?.kind).toBe("experiment");
  });

  it("exposes only the four checked demos and no invented screenshots", () => {
    expect(getProjects().flatMap(({ demo }) => demo ? [demo] : []).sort()).toEqual([
      "https://agent-pipeline-foundry.vercel.app",
      "https://njoroge-kiriro-advocates.vercel.app",
      "https://raxos-website.vercel.app",
      "https://testassessment.vercel.app",
    ]);
    expect(getProjects().some(({ image }) => image !== undefined)).toBe(false);
    expect(getProject("raxos-website")?.contribution).toBe("Built the RAXOS website.");
    expect(getProject("testassessment")?.context).toContain("does not persist");
  });

  it("keeps local provenance and referee details out of publishable records", () => {
    const published = JSON.stringify({ projects: getProjects(), profile });
    expect(published).not.toMatch(/C:[/\\]|caseStudyStatus|roleVerified|referee|source-summary-only/);
    expect(profile).toMatchObject({ displayName: "James Gatoru", email: "gatorumbugua@gmail.com" });
    expect(profile.experience).toHaveLength(5);
  });
});

describe("project lookup and navigation", () => {
  it("looks up an exact slug and returns undefined for unknown slugs", () => {
    expect(getProject("igc-portal")?.title).toBe("IGC Portal");
    expect(getProject("unknown")).toBeUndefined();
  });

  it("moves forward in archive order and wraps after the final project", () => {
    const projects = getProjects();
    expect(getNextProject(projects[0].slug)?.slug).toBe(projects[1].slug);
    expect(getNextProject(projects.at(-1)!.slug)?.slug).toBe(projects[0].slug);
    expect(getNextProject("unknown")).toBeUndefined();
  });
});

describe("project filtering", () => {
  it("matches titles and technologies case-insensitively with surrounding whitespace", () => {
    expect(filterProjects(getProjects(), "  iGc pOrTaL  ", "all").map(({ slug }) => slug)).toEqual(["igc-portal"]);
    expect(filterProjects(getProjects(), "nEsTjS", "all").map(({ slug }) => slug)).toEqual(["consignment-management"]);
  });

  it("combines category and query while retaining the original archive order", () => {
    const projects = getProjects();
    const result = filterProjects(projects, "React", "web applications");
    expect(result.map(({ slug }) => slug)).toEqual(["kalamu", "iot-school", "mechwangu", "church-management"]);
    expect(filterProjects(projects, "NestJS", "AI & automation")).toEqual([]);
    expect(filterProjects(projects, "", "unknown-category")).toEqual([]);
    expect(projects).toHaveLength(28);
  });

  it("returns all records for an empty query and all category, and handles empty inputs", () => {
    expect(filterProjects(getProjects(), " ", "All")).toEqual(getProjects());
    expect(filterProjects(getProjects(), "", "")).toEqual(getProjects());
    expect(filterProjects([], "react", "all")).toEqual([]);
    expect(filterProjects(getProjects(), "no-such-project", "all")).toEqual([]);
  });
});
