import { describe, expect, it } from "vitest";
import { resolveEffectsPolicy } from "./effects-policy";

const enabled = { preference: "auto" as const, reducedMotion: false, finePointer: true, hover: true, visible: true, documentVisible: true };

describe("effects policy", () => {
  it("enables the visible fine-pointer composition", () => {
    expect(resolveEffectsPolicy(enabled)).toEqual({ ambient: true, pointer: true });
  });

  it.each([
    { preference: "off" as const },
    { reducedMotion: true },
    { visible: false },
    { documentVisible: false },
    { preference: "off" as const, reducedMotion: true, finePointer: false },
  ])("stops all decoration for %j", (change) => {
    expect(resolveEffectsPolicy({ ...enabled, ...change })).toEqual({ ambient: false, pointer: false });
  });

  it.each([{ finePointer: false }, { hover: false }, { finePointer: false, hover: false }])("disables pointer effects for %j", (change) => {
    expect(resolveEffectsPolicy({ ...enabled, ...change })).toEqual({ ambient: true, pointer: false });
  });

  it("recomputes live Off, Auto and operating-system preference changes", () => {
    expect(resolveEffectsPolicy({ ...enabled, preference: "off" })).toEqual({ ambient: false, pointer: false });
    expect(resolveEffectsPolicy(enabled)).toEqual({ ambient: true, pointer: true });
    expect(resolveEffectsPolicy({ ...enabled, reducedMotion: true })).toEqual({ ambient: false, pointer: false });
    expect(resolveEffectsPolicy(enabled)).toEqual({ ambient: true, pointer: true });
  });
});
