import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { getProjects, getNextProject } from "./projects";
import { profile } from "../content/profile";

function readPage(path: string) {
  const html = readFileSync(resolve("out", path), "utf8");
  return new DOMParser().parseFromString(html, "text/html");
}

describe("fresh server-build verification HTML without JavaScript", () => {
  it("contains the complete homepage and confirmed contact", () => {
    const page = readPage("index.html");
    expect(page.querySelector("h1")?.textContent).toContain("James");
    for (const id of ["work", "capabilities", "experience", "about", "contact"]) {
      expect(page.querySelector(`#${id} h2`), id).not.toBeNull();
    }
    expect(page.querySelector(`a[href="mailto:${profile.email}"]`)).not.toBeNull();
    expect(page.querySelector('a[href="/work/"]')).not.toBeNull();
    expect(page.querySelector('a[href="/james-gatoru-cv.pdf"]')).not.toBeNull();
  });

  it("lists the curated projects without the removed supporting section before hydration", () => {
    const page = readPage("work/index.html");
    expect(page.querySelector("h1")?.textContent).toContain("Work");
    for (const project of getProjects()) {
      const link = page.querySelector(`a[href="/work/${project.slug}/"]`);
      expect(link?.textContent, project.slug).toContain(project.title);
      if (["fork", "supporting"].includes(project.kind)) {
        expect(link?.closest("section")?.id).toBe("supporting-repositories");
      }
    }
    expect(page.querySelector('label[for="project-search"]')).not.toBeNull();
    expect(page.querySelector("#supporting-repositories")).toBeNull();
    expect(page.querySelector('a[href="/work/lugawa/"]')).toBeNull();
    expect(page.querySelector("noscript")?.textContent).toContain("all projects");
  });

  for (const project of getProjects()) {
    it(`exports meaningful content and working navigation for /work/${project.slug}/`, () => {
      const page = readPage(`work/${project.slug}/index.html`);
      expect(page.querySelector("h1")?.textContent).toBe(project.title);
      expect(page.querySelector("main")?.textContent).toContain(project.summary);
      expect(page.querySelector('main a[href="/work/"]')?.textContent).toBe("Back to work");
      expect(page.querySelector(`a[href="/work/${getNextProject(project.slug)?.slug}/"]`)).not.toBeNull();
      expect(page.querySelector(`a[href="mailto:${profile.email}"]`)).not.toBeNull();
      if (project.repository) expect(page.querySelector(`a[href="${project.repository}"]`)).not.toBeNull();
      if (project.demo) expect(page.querySelector(`a[href="${project.demo}"]`)).not.toBeNull();
      expect(page.querySelectorAll("h1")).toHaveLength(1);
      for (const link of page.querySelectorAll<HTMLAnchorElement>('a[href^="/"]')) {
        const url = new URL(link.getAttribute("href")!, "https://portfolio.test");
        const file = url.pathname.endsWith("/") ? `${url.pathname}index.html` : url.pathname;
        expect(existsSync(resolve("out", `.${file}`)), link.href).toBe(true);
      }
    });
  }

  it("exports a useful recovery page for an unknown URL", () => {
    const page = readPage("404.html");
    expect(page.querySelector("h1")?.textContent).toContain("Page not found");
    expect(page.querySelector('main a[href="/work/"]')).not.toBeNull();
    expect(page.querySelector('main a[href="/"]')).not.toBeNull();
  });
});
