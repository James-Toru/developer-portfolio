import type { EffectsPreference } from "./effects-policy";
export const effectsStorageKey = "midnight-network:effects";
const changedEvent = "midnight-network:effects-change";
let memory: EffectsPreference | null = null;

export function readEffectsPreference(): EffectsPreference {
  if (memory !== null) return memory;
  try { return window.localStorage.getItem(effectsStorageKey) === "off" ? "off" : "auto"; }
  catch { return "auto"; }
}

export function setEffectsPreference(next: EffectsPreference) {
  try { window.localStorage.setItem(effectsStorageKey, next); memory = null; }
  catch { memory = next; /* Selection still works when persistence is denied. */ }
  window.dispatchEvent(new Event(changedEvent));
}

export function subscribeEffectsPreference(notify: () => void) {
  function storageChanged(event: StorageEvent) {
    if (event.key !== effectsStorageKey && event.key !== null) return;
    memory = null;
    notify();
  }
  window.addEventListener(changedEvent, notify);
  window.addEventListener("storage", storageChanged);
  return () => {
    window.removeEventListener(changedEvent, notify);
    window.removeEventListener("storage", storageChanged);
  };
}
