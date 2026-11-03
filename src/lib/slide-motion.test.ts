import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { startSlideMotion, type SlideAnimate } from "./slide-motion";
import { setEffectsPreference } from "./effects-preference";

class Preference extends EventTarget {
  matches = false;
  set(matches: boolean) { this.matches = matches; this.dispatchEvent(new Event("change")); }
}
class Observer {
  targets = new Set<Element>();
  observe = vi.fn((target: Element) => this.targets.add(target));
  unobserve = vi.fn((target: Element) => this.targets.delete(target));
  disconnect = vi.fn(() => this.targets.clear());
  constructor(readonly callback: IntersectionObserverCallback) { observers.push(this); }
  emit(target: Element, isIntersecting = true) {
    this.callback([{ target, isIntersecting } as IntersectionObserverEntry], this as unknown as IntersectionObserver);
  }
}
let observers: Observer[];
let reduced: Preference;
let mobile: Preference;
let fixture: HTMLDivElement;
let dispose: () => void;
let hidden: boolean;
type Flight = { target: HTMLElement; finish: () => void; complete: ReturnType<typeof vi.fn>; cancel: ReturnType<typeof vi.fn> };
let flights: Flight[];
let animate: ReturnType<typeof vi.fn<SlideAnimate>>;
let load: ReturnType<typeof vi.fn<() => Promise<SlideAnimate>>>;
const flush = async () => { for (let i = 0; i < 8; i++) await Promise.resolve(); };
const heading = () => fixture.querySelector<HTMLElement>(".section-title")!;
function start() { dispose = startSlideMotion(load); }

beforeEach(() => {
  window.localStorage.clear();
  setEffectsPreference("auto");
  observers = []; flights = []; hidden = false;
  reduced = new Preference(); mobile = new Preference();
  vi.spyOn(document, "hidden", "get").mockImplementation(() => hidden);
  vi.stubGlobal("matchMedia", (query: string) => query.includes("max-width") ? mobile : reduced);
  vi.stubGlobal("IntersectionObserver", Observer);
  Object.defineProperty(Element.prototype, "animate", { configurable: true, value: vi.fn() });
  fixture = document.createElement("div");
  fixture.innerHTML = '<h2 class="section-title">Work</h2><div class="selected-project"><div class="project-plate">Preview</div><div class="selected-copy">Project</div></div>';
  document.body.append(fixture);
  animate = vi.fn((target, keyframes) => {
    let resolve!: () => void;
    const finished = new Promise<void>(done => { resolve = done; });
    const finish = () => {
      target.style.transform = keyframes.transform[1];
      target.style.opacity = String(keyframes.opacity[1]);
      resolve();
    };
    const complete = vi.fn(finish);
    const cancel = vi.fn();
    flights.push({ target, finish, complete, cancel });
    return { finished, complete, cancel };
  });
  load = vi.fn(async () => animate);
  dispose = () => {};
});
afterEach(async () => {
  dispose(); await flush();
  fixture.remove();
  delete (Element.prototype as Partial<Element>).animate;
  vi.restoreAllMocks(); vi.unstubAllGlobals();
});

describe("Framer slide lifecycle", () => {
  it("loads only for visible content, animates once and releases finished targets", async () => {
    start();
    expect(load).not.toHaveBeenCalled();
    expect(heading().style.cssText).toBe("");
    observers[0].emit(heading()); await flush();
    expect(animate).toHaveBeenCalledTimes(1);
    expect(observers[0].targets.has(heading())).toBe(true);
    flights[0].finish(); await flush();
    expect(heading().style.cssText).toBe("");
    expect(observers[0].targets.has(heading())).toBe(false);
    expect(flights[0].cancel).toHaveBeenCalledOnce();
    observers[0].emit(heading()); await flush();
    expect(animate).toHaveBeenCalledTimes(1);
    [...observers[0].targets].forEach(target => observers[0].emit(target)); await flush();
    flights.slice(1).forEach(flight => flight.finish()); await flush();
    expect(observers[0].disconnect).toHaveBeenCalled();
  });

  it.each(["off", "reduced", "hidden", "offscreen", "unmount"])("settles a running slide when %s without retaining inline animation styles", async reason => {
    heading().style.transform = "scale(1.05)";
    heading().style.opacity = ".9";
    start(); observers[0].emit(heading()); await flush();
    if (reason === "off") setEffectsPreference("off");
    if (reason === "reduced") reduced.set(true);
    if (reason === "hidden") { hidden = true; document.dispatchEvent(new Event("visibilitychange")); }
    if (reason === "offscreen") observers[0].emit(heading(), false);
    if (reason === "unmount") dispose();
    await flush();
    expect(flights[0].complete).toHaveBeenCalledOnce();
    expect(flights[0].cancel).toHaveBeenCalledOnce();
    expect(heading().style.transform).toBe("scale(1.05)");
    expect(heading().style.opacity).toBe("0.9");
    expect(observers[0].targets.has(heading())).toBe(false);
    setEffectsPreference("auto"); reduced.set(false); hidden = false;
    document.dispatchEvent(new Event("visibilitychange"));
    observers.at(-1)?.emit(heading()); await flush();
    expect(animate).toHaveBeenCalledTimes(1);
  });

  it.each(["off", "reduced", "hidden", "unmount"])("ignores a late library import after %s", async reason => {
    let resolve!: (value: SlideAnimate) => void;
    load = vi.fn(() => new Promise<SlideAnimate>(done => { resolve = done; }));
    start(); observers[0].emit(heading());
    if (reason === "off") setEffectsPreference("off");
    if (reason === "reduced") reduced.set(true);
    if (reason === "hidden") { hidden = true; document.dispatchEvent(new Event("visibilitychange")); }
    if (reason === "unmount") dispose();
    resolve(animate); await flush();
    expect(animate).not.toHaveBeenCalled();
    expect(heading().style.cssText).toBe("");
  });

  it("does not animate a target that leaves while the library is loading", async () => {
    let resolve!: (value: SlideAnimate) => void;
    load = vi.fn(() => new Promise<SlideAnimate>(done => { resolve = done; }));
    start(); observers[0].emit(heading()); observers[0].emit(heading(), false);
    resolve(animate); await flush();
    expect(animate).not.toHaveBeenCalled();
    observers[0].emit(heading()); await flush();
    expect(animate).toHaveBeenCalledTimes(1);
  });

  it("keeps watching a running target after a redundant Auto notification", async () => {
    start(); observers[0].emit(heading()); await flush();
    setEffectsPreference("auto");
    expect(observers).toHaveLength(1);
    expect(observers[0].targets.has(heading())).toBe(true);
    observers[0].emit(heading(), false); await flush();
    expect(flights[0].complete).toHaveBeenCalledOnce();
    expect(heading().style.cssText).toBe("");
  });

  it("ignores an old import after re-enabling and accepts the current import", async () => {
    const resolvers: Array<(value: SlideAnimate) => void> = [];
    load = vi.fn(() => new Promise<SlideAnimate>(resolve => resolvers.push(resolve)));
    start(); observers[0].emit(heading());
    setEffectsPreference("off"); setEffectsPreference("auto");
    observers[1].emit(heading());
    resolvers[0](animate); await flush();
    expect(animate).not.toHaveBeenCalled();
    resolvers[1](animate); await flush();
    expect(animate).toHaveBeenCalledTimes(1);
  });

  it("releases subscriptions and ignores a stale observer after unmount", async () => {
    const removeReduced = vi.spyOn(reduced, "removeEventListener");
    start();
    dispose();
    expect(removeReduced).toHaveBeenCalledWith("change", expect.any(Function));
    observers[0].emit(heading());
    setEffectsPreference("off"); setEffectsPreference("auto"); reduced.set(true); reduced.set(false);
    await flush();
    expect(load).not.toHaveBeenCalled();
    expect(observers).toHaveLength(1);
    expect(observers[0].targets.size).toBe(0);
  });

  it("uses shorter mobile travel, complementary project slides and no nested entrance", async () => {
    mobile.matches = true;
    fixture.innerHTML += '<div class="hero-intro"><h1 id="hero-title" class="section-title">James</h1></div><nav class="hero-index">Work</nav><div class="skills-group">Tools</div>'.repeat(5);
    start();
    expect([...observers[0].targets].every(target => target.id !== "hero-title")).toBe(true);
    [...observers[0].targets].forEach(target => observers[0].emit(target)); await flush();
    const copy = animate.mock.calls.find(([target]) => target.classList.contains("selected-copy"))!;
    const plate = animate.mock.calls.find(([target]) => target.classList.contains("project-plate"))!;
    expect(copy[1].transform[0]).toContain("-10px");
    expect(plate[1].transform[0]).toContain("10px");
    for (const [, keyframes, options] of animate.mock.calls) {
      const distance = keyframes.transform[0].match(/-?\d+(?:\.\d+)?px/g)!.map(value => Math.abs(parseFloat(value)));
      expect(Math.max(...distance)).toBeLessThanOrEqual(12);
      expect(options.duration).toBeLessThanOrEqual(.42);
      expect(options.delay).toBeLessThanOrEqual(.18);
    }
  });

  it.each(["off", "reduced", "hidden", "waapi", "observer"])("leaves the document static with %s", reason => {
    if (reason === "off") setEffectsPreference("off");
    if (reason === "reduced") reduced.matches = true;
    if (reason === "hidden") hidden = true;
    if (reason === "waapi") delete (Element.prototype as Partial<Element>).animate;
    if (reason === "observer") vi.stubGlobal("IntersectionObserver", undefined);
    start();
    expect(observers).toHaveLength(0);
    expect(load).not.toHaveBeenCalled();
    expect(heading().style.cssText).toBe("");
  });

  it("keeps static content and absorbs a failed optional import", async () => {
    load = vi.fn(async () => { throw new Error("offline"); });
    start(); observers[0].emit(heading()); await flush();
    expect(animate).not.toHaveBeenCalled();
    expect(heading().style.cssText).toBe("");
    expect(observers[0].disconnect).toHaveBeenCalled();
  });
});
