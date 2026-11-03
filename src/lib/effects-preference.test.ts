import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => { window.localStorage.clear(); vi.restoreAllMocks(); });

describe("shared effects preference", () => {
  it("notifies every control and keeps Off usable when storage is denied", async () => {
    vi.resetModules();
    const { readEffectsPreference, setEffectsPreference, subscribeEffectsPreference } = await import("./effects-preference");
    const first = vi.fn(), second = vi.fn();
    const stopFirst = subscribeEffectsPreference(first), stopSecond = subscribeEffectsPreference(second);
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("Denied"); });
    setEffectsPreference("off");
    expect(readEffectsPreference()).toBe("off");
    expect(first).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenCalledTimes(1);
    stopFirst(); stopSecond();
    setEffectsPreference("auto");
    expect(first).toHaveBeenCalledTimes(1);
  });

  it("reads saved settings and responds to another tab's changes", async () => {
    vi.resetModules();
    const { readEffectsPreference, setEffectsPreference, subscribeEffectsPreference, effectsStorageKey } = await import("./effects-preference");
    window.localStorage.setItem(effectsStorageKey, "off");
    expect(readEffectsPreference()).toBe("off");
    setEffectsPreference("auto");
    const changed = vi.fn();
    const stop = subscribeEffectsPreference(changed);
    window.localStorage.setItem(effectsStorageKey, "off");
    window.dispatchEvent(new StorageEvent("storage", { key: effectsStorageKey }));
    expect(changed).toHaveBeenCalledTimes(1);
    expect(readEffectsPreference()).toBe("off");
    stop();
  });
});
