import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mountFloatingNetwork, type NetworkSettings } from "./floating-network";

const active: NetworkSettings = { animate: true, interactive: true, compact: false };
let canvas: HTMLCanvasElement;
let controller: ReturnType<typeof mountFloatingNetwork>;
let frames: Map<number, FrameRequestCallback>;
let serial = 0;
let points: number[][];
let paints: number;
let context: CanvasRenderingContext2D;

function tick(time: number) {
  const pending = [...frames.values()];
  frames.clear();
  pending.forEach((callback) => callback(time));
}

function pointer(x: number, y: number, pointerType = "mouse") {
  const event = new MouseEvent("pointermove", { clientX: x, clientY: y });
  Object.defineProperty(event, "pointerType", { value: pointerType });
  window.dispatchEvent(event);
}

function visibility(hidden: boolean) {
  Object.defineProperty(document, "hidden", { configurable: true, value: hidden });
  document.dispatchEvent(new Event("visibilitychange"));
}

beforeEach(() => {
  points = [];
  paints = 0;
  frames = new Map();
  Object.defineProperty(document, "hidden", { configurable: true, value: false });
  Object.defineProperty(document.documentElement, "clientWidth", { configurable: true, value: 1000 });
  vi.stubGlobal("innerWidth", 1020);
  vi.stubGlobal("innerHeight", 800);
  vi.stubGlobal("devicePixelRatio", 3);
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => { frames.set(++serial, callback); return serial; });
  vi.stubGlobal("cancelAnimationFrame", (id: number) => frames.delete(id));
  vi.spyOn(Math, "random").mockReturnValue(0.5);
  // jsdom has no rasterizer: record the controller's actual drawing commands.
  context = {
    clearRect() { paints++; points = []; },
    arc(x: number, y: number) { points.push([x, y]); },
    setTransform() {}, beginPath() {}, moveTo() {}, lineTo() {}, stroke() {}, fill() {},
  } as unknown as CanvasRenderingContext2D;
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(context);
  canvas = document.createElement("canvas");
});

afterEach(() => {
  controller?.destroy();
  controller = undefined;
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("floating network resource and input policy", () => {
  it("draws a stationary constellation once without scheduling animation", () => {
    controller = mountFloatingNetwork(canvas, { ...active, animate: false });
    expect(controller).toBeDefined();
    expect(points).toHaveLength(48);
    expect(paints).toBe(1);
    pointer(500, 400);
    expect(frames.size).toBe(0);
    expect(paints).toBe(1);
  });

  it.each([{ compact: false, limit: 30 }, { compact: true, limit: 15 }])(
    "caps drawn frames at $limit per second (compact=$compact)", ({ compact, limit }) => {
      controller = mountFloatingNetwork(canvas, { ...active, compact });
      const initial = points.map((point) => [...point]);
      const initialPaints = paints;
      for (let time = 0; time < 1000; time += 4) tick(time);
      expect(paints - initialPaints).toBeGreaterThan(10);
      expect(paints - initialPaints).toBeLessThanOrEqual(limit);
      expect(points).not.toEqual(initial);
      expect(frames.size).toBe(1);
    },
  );

  it("uses viewport client width and bounds desktop and compact backing stores", () => {
    controller = mountFloatingNetwork(canvas, { ...active, animate: false });
    expect(canvas.width).toBe(1500);
    expect(canvas.height).toBe(1200);
    controller!.update({ ...active, animate: false, compact: true });
    expect(points).toHaveLength(20);
    expect(canvas.width).toBe(1000);
    expect(canvas.height).toBe(800);
    Object.defineProperty(document.documentElement, "clientWidth", { configurable: true, value: 6000 });
    vi.stubGlobal("innerHeight", 4000);
    window.dispatchEvent(new Event("resize"));
    expect(canvas.width * canvas.height).toBeLessThanOrEqual(4_000_000);
    expect(frames.size).toBe(0);
  });

  it("falls back to innerWidth when clientWidth is unavailable", () => {
    Object.defineProperty(document.documentElement, "clientWidth", { configurable: true, value: 0 });
    controller = mountFloatingNetwork(canvas, { ...active, animate: false, compact: true });
    expect(canvas.width).toBe(1020);
  });

  it("suspends hidden tabs and resumes without jumping across the hidden interval", () => {
    controller = mountFloatingNetwork(canvas, active);
    tick(0); tick(40);
    const before = points.map((point) => [...point]);
    const count = paints;
    visibility(true);
    expect(frames.size).toBe(0);
    window.dispatchEvent(new Event("resize"));
    expect(paints).toBe(count);
    visibility(false);
    expect(frames.size).toBe(1);
    tick(100000);
    tick(100040);
    expect(Math.hypot(points[0][0] - before[0][0], points[0][1] - before[0][1])).toBeLessThan(2);
  });

  it("does not start drawing or scheduling while initially hidden", () => {
    visibility(true);
    controller = mountFloatingNetwork(canvas, active);
    expect(paints).toBe(0);
    expect(frames.size).toBe(0);
    visibility(false);
    expect(paints).toBeGreaterThan(0);
    expect(frames.size).toBe(1);
  });

  it("ignores touch and bounds fine-pointer excursions without measuring DOM per frame", () => {
    const measure = vi.spyOn(canvas, "getBoundingClientRect");
    controller = mountFloatingNetwork(canvas, active);
    tick(0); tick(40);
    const before = [...points[0]];
    pointer(before[0] - 1, before[1], "touch");
    tick(80);
    expect(Math.hypot(points[0][0] - before[0], points[0][1] - before[1])).toBeLessThan(1);
    const unperturbed = [...points[0]];
    pointer(unperturbed[0] - 1, unperturbed[1]);
    expect(points[0]).toEqual(unperturbed);
    tick(120);
    const excursion = Math.hypot(points[0][0] - unperturbed[0], points[0][1] - unperturbed[1]);
    expect(excursion).toBeGreaterThan(1);
    expect(excursion).toBeLessThanOrEqual(18.5);
    expect(measure).not.toHaveBeenCalled();
  });

  it("removes pointer influence when interactivity is disabled and stops on static update", () => {
    controller = mountFloatingNetwork(canvas, active);
    tick(0); tick(40);
    const before = [...points[0]];
    controller!.update({ ...active, interactive: false });
    pointer(before[0] - 1, before[1]);
    tick(80);
    expect(Math.hypot(points[0][0] - before[0], points[0][1] - before[1])).toBeLessThan(1);
    controller!.update({ ...active, animate: false });
    expect(frames.size).toBe(0);
    const count = paints;
    pointer(0, 0); tick(120);
    expect(paints).toBe(count);
  });

  it("cleans up pending work and listeners and cannot restart after destruction", () => {
    controller = mountFloatingNetwork(canvas, active);
    controller!.destroy();
    expect(frames.size).toBe(0);
    const count = paints;
    const width = canvas.width;
    vi.stubGlobal("innerHeight", 1400);
    window.dispatchEvent(new Event("resize"));
    visibility(true); visibility(false); pointer(0, 0);
    controller!.update(active); controller!.destroy();
    expect(canvas.width).toBe(width);
    expect(paints).toBe(count);
    expect(frames.size).toBe(0);
  });

  it("leaves no running enhancement when a 2D context is unavailable", () => {
    vi.mocked(canvas.getContext).mockReturnValue(null);
    expect(mountFloatingNetwork(canvas, active)).toBeUndefined();
    expect(frames.size).toBe(0);
  });
});
