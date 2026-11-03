import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SiteMotion } from "./site-motion";

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
  vi.restoreAllMocks(); vi.unstubAllGlobals();
});

describe("bounded site motion", () => {
  it("keeps content visible before intersection and releases completed targets", async () => {
    await render();
    expect(observe).toHaveBeenCalledTimes(3);
    expect(headings().every(node => !node.hidden && !node.classList.contains("motion-enter"))).toBe(true);
    enter([headings()[0]]);
    expect(headings()[0].classList.contains("motion-enter")).toBe(true);
    expect(unobserve).toHaveBeenCalledWith(headings()[0]);
    expect(disconnect).not.toHaveBeenCalled();
    enter(headings().slice(1));
    expect(disconnect).toHaveBeenCalledTimes(1);
  });

  it("respects reduced motion initially and when the preference changes live", async () => {
    preference.matches = true;
    await render();
    expect(created).not.toHaveBeenCalled();
    preference.set(false);
    expect(observe).toHaveBeenCalledTimes(3);
    enter([headings()[0]]);
    preference.set(true);
    expect(disconnect).toHaveBeenCalled();
    expect(headings().every(node => !node.classList.contains("motion-enter"))).toBe(true);
  });

  it("leaves the complete reading surface available when observation is unsupported", async () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    await render();
    expect(fixture.textContent).toContain("Selected work");
    expect(headings().every(node => !node.hidden && !node.classList.contains("motion-enter"))).toBe(true);
    expect(created).not.toHaveBeenCalled();
  });

  it("cleans up observers, preference subscriptions and animation classes on unmount", async () => {
    const remove = vi.spyOn(preference, "removeEventListener");
    await render();
    const previousCallback = callback;
    enter([headings()[0]]);
    await act(async () => { app.unmount(); });
    app = createRoot(host);
    expect(disconnect).toHaveBeenCalled();
    expect(remove).toHaveBeenCalledWith("change", expect.any(Function));
    previousCallback([intersection(headings()[1])], observer);
    expect(headings().every(node => !node.classList.contains("motion-enter"))).toBe(true);
  });
});
