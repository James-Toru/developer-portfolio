import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BackToTop } from "./back-to-top";

let root: Root;
let host: HTMLDivElement;
let main: HTMLElement;
let reduced: boolean;
let frames: Map<number, FrameRequestCallback>;
let serial = 0;
let resize: ResizeObserverCallback;
const disconnect = vi.fn();
const scrollTo = vi.fn();
const button = () => host.querySelector<HTMLButtonElement>('button[aria-label="Back to top"]')!;
async function paint() {
  await act(async () => { const pending = [...frames.values()]; frames.clear(); pending.forEach(fn => fn(16)); });
}
async function render() { await act(async () => { root.render(<BackToTop />); }); await paint(); }
function scroll(y: number) { vi.stubGlobal("scrollY", y); window.dispatchEvent(new Event("scroll")); }

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  vi.stubGlobal("innerHeight", 800); vi.stubGlobal("scrollY", 0);
  vi.spyOn(document.documentElement, "scrollHeight", "get").mockReturnValue(4000);
  reduced = false;
  vi.stubGlobal("matchMedia", () => ({ matches: reduced }));
  vi.stubGlobal("scrollTo", scrollTo);
  frames = new Map();
  vi.stubGlobal("requestAnimationFrame", (fn: FrameRequestCallback) => { frames.set(++serial, fn); return serial; });
  vi.stubGlobal("cancelAnimationFrame", (id: number) => { frames.delete(id); });
  vi.stubGlobal("ResizeObserver", class { constructor(callback: ResizeObserverCallback) { resize = callback; } observe() {} disconnect = disconnect; });
  host = document.createElement("div"); main = document.createElement("main");
  main.id = "main-content"; main.tabIndex = -1;
  document.body.append(main, host); root = createRoot(host);
});
afterEach(async () => { await act(async () => { root.unmount(); }); main.remove(); host.remove(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });

describe("return signal", () => {
  it("only enables after scrolling and coalesces events into bounded progress updates", async () => {
    await render(); expect(button().disabled).toBe(true);
    scroll(700); scroll(1600);
    expect(frames.size).toBe(1); await paint();
    expect(button().disabled).toBe(false);
    expect(host.querySelector<SVGPathElement>(".return-progress")!.style.strokeDashoffset).toBe("50");
    scroll(0); await paint(); expect(button().disabled).toBe(true);
  });
  it("clamps progress and stays hidden on a page without scrollable content", async () => {
    vi.spyOn(document.documentElement, "scrollHeight", "get").mockReturnValue(800);
    await render(); scroll(900); await paint();
    expect(button().disabled).toBe(true);
    expect(host.querySelector<SVGPathElement>(".return-progress")!.style.strokeDashoffset).toBe("0");
  });
  it("returns focus to main and chooses native smooth or instant scrolling from the live motion preference", async () => {
    await render(); scroll(900); await paint();
    await act(async () => { button().click(); });
    expect(document.activeElement).toBe(main);
    expect(scrollTo).toHaveBeenLastCalledWith({ top: 0, behavior: "smooth" });
    reduced = true;
    await act(async () => { button().click(); });
    expect(scrollTo).toHaveBeenLastCalledWith({ top: 0, behavior: "instant" });
  });
  it("releases pending work, subscriptions and observation when unmounted", async () => {
    const remove = vi.spyOn(window, "removeEventListener");
    await render(); scroll(900); expect(frames.size).toBe(1);
    await act(async () => { root.unmount(); }); root = createRoot(host);
    expect(frames.size).toBe(0); expect(disconnect).toHaveBeenCalledTimes(1);
    expect(remove).toHaveBeenCalledWith("scroll", expect.any(Function));
    expect(remove).toHaveBeenCalledWith("resize", expect.any(Function));
    scroll(1000); expect(frames.size).toBe(0);
  });
  it("ignores a delayed resize callback after an idle unmount", async () => {
    await render(); expect(frames.size).toBe(0);
    await act(async () => { root.unmount(); }); root = createRoot(host);
    resize([], {} as ResizeObserver);
    expect(frames.size).toBe(0);
  });
});
