import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SiteMotion } from "./site-motion";
import { setEffectsPreference } from "@/lib/effects-preference";

class MotionPreference extends EventTarget {
  matches = false;
  set(value: boolean) { this.matches = value; this.dispatchEvent(new Event("change")); }
}
let app: Root;
let host: HTMLDivElement;
let fixture: HTMLDivElement;
let preference: MotionPreference;
let callback: IntersectionObserverCallback;
let observer: IntersectionObserver;
const observe = vi.fn();
const unobserve = vi.fn();
const disconnect = vi.fn();
const created = vi.fn();
const animateMini = vi.hoisted(() => vi.fn());
vi.mock("framer-motion/dom/mini", () => ({ animate: animateMini }));
const headings = () => [...fixture.querySelectorAll<HTMLElement>(".section-title, .selected-copy, .archive-heading")];
async function render() { await act(async () => { app.render(<SiteMotion />); }); }
function intersection(target: HTMLElement): IntersectionObserverEntry {
  const bounds = target.getBoundingClientRect();
  return { target, isIntersecting: true, intersectionRatio: 1, boundingClientRect: bounds, intersectionRect: bounds, rootBounds: null, time: 0 };
}
function enter(targets: HTMLElement[]) {
  callback(targets.map(intersection), observer);
}

beforeEach(() => {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  vi.clearAllMocks();
  window.localStorage.clear();
  preference = new MotionPreference();
  vi.stubGlobal("matchMedia", () => preference);
  vi.stubGlobal("IntersectionObserver", class {
    observe = observe;
    unobserve = unobserve;
    disconnect = disconnect;
    constructor(value: IntersectionObserverCallback) { created(); callback = value; observer = this as unknown as IntersectionObserver; }
  });
  fixture = document.createElement("div");
  fixture.innerHTML = '<h2 class="section-title">Selected work</h2><div class="selected-copy">A project introduction</div><header class="archive-heading">Work archive</header><p>Ordinary copy</p>';
  host = document.createElement("div");
  document.body.append(fixture, host);
  app = createRoot(host);
});
afterEach(async () => {
  await act(async () => { app.unmount(); });
  fixture.remove(); host.remove();
  delete (Element.prototype as Partial<Element>).animate;
  vi.restoreAllMocks(); vi.unstubAllGlobals();
});

describe("bounded site motion", () => {
  it("runs line signals only while visible, enabled and in an active tab", async () => {
    fixture.innerHTML = '<article class="skills-group">Skills</article><li class="career-stop-current">Current role</li><h1 id="hero-title">James Gatoru</h1>';
    let hidden = false;
    vi.spyOn(document, "hidden", "get").mockImplementation(() => hidden);
    await render();
    const targets = [...fixture.querySelectorAll<HTMLElement>(".skills-group, .career-stop-current, #hero-title")];
    expect(targets.every(target => !target.classList.contains("signal-active"))).toBe(true);
    enter(targets);
    expect(targets.every(target => target.classList.contains("signal-active"))).toBe(true);
    callback([{ ...intersection(targets[0]), isIntersecting: false }], observer);
    expect(targets[0].classList.contains("signal-active")).toBe(false);
    hidden = true;
    document.dispatchEvent(new Event("visibilitychange"));
    expect(targets.every(target => !target.classList.contains("signal-active"))).toBe(true);
    hidden = false;
    document.dispatchEvent(new Event("visibilitychange"));
    expect(targets[1].classList.contains("signal-active")).toBe(true);
    setEffectsPreference("off");
    expect(targets[1].classList.contains("signal-active")).toBe(false);
    setEffectsPreference("auto");
    expect(targets[1].classList.contains("signal-active")).toBe(true);
    preference.set(true);
    expect(targets[1].classList.contains("signal-active")).toBe(false);
    preference.set(false);
    expect(targets[1].classList.contains("signal-active")).toBe(true);
  });

  it("leaves signals static for reduced motion and releases their lifecycle on unmount", async () => {
    fixture.innerHTML = '<article class="skills-group">Skills</article>';
    preference.matches = true;
    await render();
    const target = fixture.firstElementChild as HTMLElement;
    enter([target]);
    expect(target.classList.contains("signal-active")).toBe(false);
    preference.set(false);
    enter([target]);
    expect(target.classList.contains("signal-active")).toBe(true);
    const stale = callback;
    await act(async () => { app.unmount(); });
    app = createRoot(host);
    stale([intersection(target)], observer);
    setEffectsPreference("off");
    setEffectsPreference("auto");
    expect(target.classList.contains("signal-active")).toBe(false);
    expect(disconnect).toHaveBeenCalled();
  });

  it("lazily slides visible headings with Framer Motion and leaves ordinary copy alone", async () => {
    Object.defineProperty(Element.prototype, "animate", { configurable: true, value: vi.fn() });
    animateMini.mockImplementation(() => ({ finished: Promise.resolve(), complete: vi.fn(), cancel: vi.fn() }));
    await render();
    expect(animateMini).not.toHaveBeenCalled();
    expect(headings().every(node => !node.hidden && node.style.opacity === "")).toBe(true);
    await act(async () => { enter([headings()[0]]); });
    expect(animateMini).toHaveBeenCalledWith(headings()[0], expect.objectContaining({ opacity: [.75, 1], transform: expect.any(Array) }), expect.objectContaining({ duration: expect.any(Number) }));
    expect(unobserve).toHaveBeenCalledWith(headings()[0]);
    expect(fixture.querySelector("p")?.getAttribute("style")).toBeNull();
    expect(headings()[0].style.transform).toBe("");
  });

  it("leaves the complete reading surface available when observation is unsupported", async () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    await render();
    expect(fixture.textContent).toContain("Selected work");
    expect(headings().every(node => !node.hidden && node.style.opacity === "")).toBe(true);
    expect(created).not.toHaveBeenCalled();
    expect(animateMini).not.toHaveBeenCalled();
  });
});
