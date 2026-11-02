import type { EffectsPolicy } from "./effects-policy";

export type HeroEffectsController = {
  updatePolicy(policy: EffectsPolicy): void;
  destroy(): void;
};

export function mountHeroEffects(root: HTMLElement, layers: readonly HTMLElement[], initialPolicy: EffectsPolicy): HeroEffectsController {
  const art = layers.slice(0, 3);
  let policy: EffectsPolicy = { ambient: false, pointer: false };
  let frame: number | null = null;
  let destroyed = false;
  let x = 0;
  let y = 0;

  function cancelFrame() {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
  }

  function paint() {
    frame = null;
    art.forEach((layer, index) => {
      const depth = (index + 1) / art.length;
      layer.style.setProperty("--hero-x", `${x * depth}px`);
      layer.style.setProperty("--hero-y", `${y * depth}px`);
    });
  }

  function queue() {
    if (frame === null) frame = requestAnimationFrame(paint);
  }

  function onPointerMove(event: PointerEvent) {
    if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
    const rect = root.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    x = Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1)) * 10;
    y = Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1)) * 10;
    queue();
  }

  function onPointerLeave() {
    x = 0;
    y = 0;
    queue();
  }

  function removeListeners() {
    root.removeEventListener("pointermove", onPointerMove);
    root.removeEventListener("pointerleave", onPointerLeave);
    root.removeEventListener("pointercancel", onPointerLeave);
  }

  function updatePolicy(next: EffectsPolicy) {
    if (destroyed) return;
    if (next.pointer !== policy.pointer) {
      if (next.pointer) {
        root.addEventListener("pointermove", onPointerMove, { passive: true });
        root.addEventListener("pointerleave", onPointerLeave, { passive: true });
        root.addEventListener("pointercancel", onPointerLeave, { passive: true });
      } else {
        removeListeners();
      }
    }
    policy = next;
    root.dataset.effectsAmbient = String(next.ambient);
    root.dataset.effectsPointer = String(next.pointer);
    if (!next.pointer) {
      cancelFrame();
      x = 0;
      y = 0;
      paint();
    }
  }

  updatePolicy(initialPolicy);
  return {
    updatePolicy,
    destroy() {
      if (destroyed) return;
      destroyed = true;
      removeListeners();
      cancelFrame();
      delete root.dataset.effectsAmbient;
      delete root.dataset.effectsPointer;
      art.forEach((layer) => {
        layer.style.removeProperty("--hero-x");
        layer.style.removeProperty("--hero-y");
      });
    },
  };
}
