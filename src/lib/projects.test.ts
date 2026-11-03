import { describe, expect, it } from "vitest";
import inventory from "../../docs/research/project-sources.json";
import { profile } from "../content/profile";
import { filterProjects, getNextProject, getProject, getProjects } from "./projects";
import { projectArt } from "../content/project-art";

describe("source-backed archive", () => {
  it("curates the source archive without publishing the removed repositories", () => {
    const projects = getProjects();
    expect(projects).toHaveLength(13);
    expect(new Set(projects.map(({ slug }) => slug)).size).toBe(13);
    for (const source of inventory.cvProjects.filter(({ id }) => !["lugawa", "iot-school", "texplore", "aslice", "church-management", "mechwangu"].includes(id))) {
      expect(projects.find(({ slug }) => slug === source.id), source.id).toBeDefined();
    }
    for (const slug of ["github-agent-workflow", "github-agent-workflow-test", "lugawa", "icecreamshop", "ics2409-neural-networks-assignment", "jgatoruportfolio", "lovable", "test", "login", "james-toru", "uml-diagrams", "chatgpt-vscode", "iot-school", "texplore", "aslice", "church-management", "mechwangu"]) {
      expect(getProject(slug), slug).toBeUndefined();
    }
    expect(projects.some(({ kind }) => kind === "supporting" || kind === "fork")).toBe(false);
  });

  it("keeps public repositories separate from professional CV work", () => {
    const withRepository = inventory.cvProjects.filter(({ id }) => getProject(id)?.repository);
    expect(withRepository).toEqual([]);
    expect(getProject("igc-portal")?.demo).toBe("https://igc-portal.vercel.app/");
    expect(getProject("kalamu")?.demo).toBe("https://kalamu.net/");
    expect(getProject("agentic-workflows")).toMatchObject({ organization: "TYTOS GmbH", kind: "professional" });
    expect(getProject("agentic-workflows")?.repository).toBeUndefined();
    expect(getProject("agent-pipeline-foundry")?.organization).toBeUndefined();
  });

  it("features the four major projects with supplied website destinations", () => {
    expect(getProjects().filter(({ featured }) => featured).map(({ title, demo }) => [title, demo])).toEqual([
      ["LawPro360", "https://legal.igc.co.ke/"],
      ["DOLMIS", "https://dolmis.go.ke/"],
      ["CargoForward360", "https://consignment.igc.co.ke/"],
      ["Nashami Limited", "https://nashamiltd.org/"],
    ]);
    expect(getProject("nashami-limited")?.contribution).toMatch(/logo.*graphics/i);
  });

  it("keeps screenshot evidence distinct from illustrative covers", () => {
    expect(getProjects().flatMap(({ demo }) => demo ? [demo] : []).sort()).toEqual([
      "https://agent-pipeline-foundry.vercel.app",
      "https://consignment.igc.co.ke/",
      "https://dolmis.go.ke/",
      "https://igc-portal.vercel.app/",
      "https://kalamu.net/",
      "https://legal.igc.co.ke/",
      "https://nashamiltd.org/",
      "https://njoroge-kiriro-advocates.vercel.app",
      "https://raxos-website.vercel.app",
      "https://testassessment.vercel.app",
    ].sort());
    expect(projectArt["lawpro360"]).toMatchObject({ kind: "screenshot" });
    expect(projectArt["ecms"]).toMatchObject({ kind: "illustration" });
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
    expect(result.map(({ slug }) => slug)).toEqual(["kalamu"]);
    expect(filterProjects(projects, "NestJS", "AI & automation")).toEqual([]);
    expect(filterProjects(projects, "", "unknown-category")).toEqual([]);
    expect(projects).toHaveLength(13);
  });

  it("returns all records for an empty query and all category, and handles empty inputs", () => {
    expect(filterProjects(getProjects(), " ", "All")).toEqual(getProjects());
    expect(filterProjects(getProjects(), "", "")).toEqual(getProjects());
    expect(filterProjects([], "react", "all")).toEqual([]);
    expect(filterProjects(getProjects(), "no-such-project", "all")).toEqual([]);
  });
});
