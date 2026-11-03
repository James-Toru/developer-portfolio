import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CityHero } from "./city-hero";

class MediaQuery extends EventTarget {
  matches = false;
  media: string;
  onchange = null;
  constructor(query: string) { super(); this.media = query; }
  set(matches: boolean) { this.matches = matches; this.dispatchEvent(new Event("change")); }
}

let container: HTMLDivElement;
let app: Root;
let media: Map<string, MediaQuery>;
let intersection: IntersectionObserverCallback;
let disconnected: boolean;
let hidden: boolean;
let frames: Map<number, FrameRequestCallback>;
let serial = 0;

async function render() {
  await act(async () => { app.render(<CityHero featured={[]} />); });
}
function hero() { return container.querySelector<HTMLElement>(".hero")!; }
function button(label: string) { return [...container.querySelectorAll("button")].find((item) => item.textContent === label)!; }
async function choose(label: string) { await act(async () => { button(label).click(); }); }
async function intersect(visible: boolean) {
  await act(async () => { intersection([{ isIntersecting: visible } as IntersectionObserverEntry], {} as IntersectionObserver); });
}
async function expectActive() {
  await vi.waitFor(() => expect(hero().dataset.effectsAmbient).toBe("true"));
}

beforeEach(() => {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  window.localStorage.clear();
  media = new Map();
  vi.stubGlobal("matchMedia", (query: string) => {
    if (!media.has(query)) {
      const value = new MediaQuery(query);
      value.matches = !query.includes("reduced-motion");
      media.set(query, value);
    }
    return media.get(query);
  });
  disconnected = false;
  vi.stubGlobal("IntersectionObserver", class {
    constructor(callback: IntersectionObserverCallback) { intersection = callback; }
    observe() {}
    disconnect() { disconnected = true; }
  });
  hidden = false;
  vi.spyOn(document, "hidden", "get").mockImplementation(() => hidden);
  frames = new Map();
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => { frames.set(++serial, callback); return serial; });
  vi.stubGlobal("cancelAnimationFrame", (id: number) => { frames.delete(id); });
  container = document.createElement("div");
  document.body.append(container);
  app = createRoot(container);
});

afterEach(async () => {
  await act(async () => { app.unmount(); });
  container.remove();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("CityHero preferences and subscriptions", () => {
  it("keeps the city image stationary under pointer movement while Auto rain is active", async () => {
    await render(); await intersect(true); await expectActive();
    const event = new Event("pointermove");
    Object.assign(event, { pointerType: "mouse", clientX: 900, clientY: 300 });
    await act(async () => { hero().dispatchEvent(event); });
    expect(hero().dataset.effectsPointer).not.toBe("true");
    expect(container.querySelector(".hero-art img")?.getAttribute("style")).toBeNull();
    expect(frames.size).toBe(0);
  });
  it("persists Off and restores it after remount without starting decoration", async () => {
    await render();
    await intersect(true); await expectActive();
    await choose("Off");
    expect(button("Off").getAttribute("aria-pressed")).toBe("true");
    expect(window.localStorage.getItem("midnight-network:effects")).toBe("off");
    expect(hero().dataset.effectsPointer).not.toBe("true");
    await act(async () => { app.unmount(); });
    app = createRoot(container);
    await render(); await intersect(true);
    expect(button("Off").getAttribute("aria-pressed")).toBe("true");
    expect(hero().dataset.effectsPointer).not.toBe("true");
  });

  it("keeps Auto and Off usable when storage reads and writes are denied", async () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw new DOMException("Denied", "SecurityError"); });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new DOMException("Denied", "SecurityError"); });
    await render(); await intersect(true); await expectActive();
    await choose("Off");
    expect(button("Off").getAttribute("aria-pressed")).toBe("true");
    expect(hero().dataset.effectsPointer).not.toBe("true");
    await choose("Auto"); await intersect(true); await expectActive();
    expect(button("Auto").getAttribute("aria-pressed")).toBe("true");
  });

  it("responds live to reduced motion, document visibility and offscreen changes", async () => {
    await render(); await intersect(true); await expectActive();
    await act(async () => { media.get("(prefers-reduced-motion: reduce)")!.set(true); });
    expect(hero().dataset.effectsAmbient).toBe("false");
    await act(async () => { media.get("(prefers-reduced-motion: reduce)")!.set(false); });
    await expectActive();
    hidden = true;
    await act(async () => { document.dispatchEvent(new Event("visibilitychange")); });
    expect(hero().dataset.effectsAmbient).toBe("false");
    hidden = false;
    await act(async () => { document.dispatchEvent(new Event("visibilitychange")); });
    await expectActive();
    await intersect(false);
    expect(hero().dataset.effectsAmbient).toBe("false");
    await intersect(true); await expectActive();
  });

  it("keeps the OS reduced-motion composition static from first activation", async () => {
    const reduced = new MediaQuery("(prefers-reduced-motion: reduce)");
    reduced.matches = true;
    media.set(reduced.media, reduced);
    await render(); await intersect(true);
    expect(hero().dataset.effectsPointer).not.toBe("true");
    expect(frames.size).toBe(0);
    expect(button("Auto").getAttribute("aria-pressed")).toBe("true");
  });

  it("disconnects observers and removes media/document subscriptions on unmount", async () => {
    await render(); await intersect(true); await expectActive();
    const removals = [...media.values()].map((query) => vi.spyOn(query, "removeEventListener"));
    const documentRemoval = vi.spyOn(document, "removeEventListener");
    const retainedHero = hero();
    await act(async () => { app.unmount(); });
    app = createRoot(container);
    expect(disconnected).toBe(true);
    removals.forEach((remove) => expect(remove).toHaveBeenCalledWith("change", expect.any(Function)));
    expect(documentRemoval).toHaveBeenCalledWith("visibilitychange", expect.any(Function));
    expect(frames.size).toBe(0);
    await act(async () => {
      media.forEach((query) => query.set(!query.matches));
      document.dispatchEvent(new Event("visibilitychange"));
      intersection([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver);
    });
    expect(retainedHero.dataset.effectsPointer).toBeUndefined();
  });
});
