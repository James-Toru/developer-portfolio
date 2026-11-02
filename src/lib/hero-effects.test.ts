import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mountHeroEffects, type HeroEffectsController } from "./hero-effects";

const active = { ambient: true, pointer: true };
const inactive = { ambient: false, pointer: false };
let root: HTMLElement;
let layer: HTMLElement;
let controller: HeroEffectsController;
let frames: Map<number, FrameRequestCallback>;
let serial = 0;

function move(x = 200, y = 100, pointerType = "mouse") {
  const event = new MouseEvent("pointermove", { clientX: x, clientY: y });
  Object.defineProperty(event, "pointerType", { value: pointerType });
  root.dispatchEvent(event);
}

function flush() {
  const pending = [...frames.values()];
  frames.clear();
  pending.forEach((callback) => callback(16));
}

beforeEach(() => {
  frames = new Map();
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => { frames.set(++serial, callback); return serial; });
  vi.stubGlobal("cancelAnimationFrame", (id: number) => { frames.delete(id); });
  root = document.createElement("section");
  layer = document.createElement("div");
  root.append(layer);
  document.body.append(root);
  root.getBoundingClientRect = () => ({ left: 0, top: 0, width: 200, height: 100 } as DOMRect);
});

afterEach(() => {
  controller?.destroy();
  root.remove();
  vi.unstubAllGlobals();
});

describe("hero effects lifecycle", () => {
  it("does no idle frame work and coalesces pointer movement into one bounded transform", () => {
    controller = mountHeroEffects(root, [layer], active);
    expect(frames.size).toBe(0);
    move(100, 50);
    move(9999, 9999);
    expect(frames.size).toBe(1);
    flush();
    expect(parseFloat(layer.style.getPropertyValue("--hero-x"))).toBeGreaterThan(0);
    expect(parseFloat(layer.style.getPropertyValue("--hero-x"))).toBeLessThanOrEqual(12);
    expect(parseFloat(layer.style.getPropertyValue("--hero-y"))).toBeLessThanOrEqual(12);
    expect(frames.size).toBe(0);
  });

  it("returns artwork to rest on pointer leave without creating an idle loop", () => {
    controller = mountHeroEffects(root, [layer], active);
    move(); flush();
    root.dispatchEvent(new Event("pointerleave"));
    flush();
    expect(layer.style.getPropertyValue("--hero-x")).toBe("0px");
    expect(layer.style.getPropertyValue("--hero-y")).toBe("0px");
    expect(frames.size).toBe(0);
  });

  it("ignores touch movement even if a hybrid device reports a fine pointer", () => {
    controller = mountHeroEffects(root, [layer], active);
    move(200, 100, "touch");
    expect(frames.size).toBe(0);
  });

  it("cancels queued work and clears transforms immediately when policy deactivates", () => {
    controller = mountHeroEffects(root, [layer], active);
    move(); flush(); move();
    controller.updatePolicy(inactive);
    expect(frames.size).toBe(0);
    expect(layer.style.getPropertyValue("--hero-x")).toBe("0px");
    expect(root.dataset.effectsAmbient).toBe("false");
    move();
    expect(frames.size).toBe(0);
    controller.updatePolicy(active);
    move();
    expect(frames.size).toBe(1);
  });

  it("preserves ambient policy while disabling coarse-pointer work", () => {
    controller = mountHeroEffects(root, [layer], { ambient: true, pointer: false });
    move();
    expect(root.dataset.effectsAmbient).toBe("true");
    expect(frames.size).toBe(0);
  });

  it("destroys pending work and scoped listeners, and cannot be reactivated", () => {
    controller = mountHeroEffects(root, [layer], active);
    move();
    expect(frames.size).toBe(1);
    controller.destroy();
    controller.destroy();
    controller.updatePolicy(active);
    move();
    expect(frames.size).toBe(0);
    expect(root.dataset.effectsAmbient).toBeUndefined();
    expect(layer.style.getPropertyValue("--hero-x")).toBe("");
  });
});
