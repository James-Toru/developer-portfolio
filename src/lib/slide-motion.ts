import { readEffectsPreference, subscribeEffectsPreference } from "./effects-preference";

type SlideControls = { finished: Promise<unknown>; complete: () => void; cancel: () => void };
export type SlideAnimate = (
  target: HTMLElement,
  keyframes: { opacity: number[]; transform: string[] },
  options: { duration: number; delay: number; ease: [number, number, number, number] },
) => SlideControls;

const selector = ".hero-intro, .hero-index, .selected-copy, .selected-project .project-plate, .section-title, .archive-heading, .project-heading, .career-stop, .skills-group";
const loadAnimate = async (): Promise<SlideAnimate> => (await import("framer-motion/dom/mini")).animate;

/** A once-only, native-animation enhancement. The document is visible before loading. */
export function startSlideMotion(load: () => Promise<SlideAnimate> = loadAnimate): () => void {
  if (typeof window.matchMedia !== "function" || typeof IntersectionObserver === "undefined" || typeof Element.prototype.animate !== "function") return () => {};
  // Never animate a heading separately from its animated containing composition.
  const targets = [...document.querySelectorAll<HTMLElement>(selector)].filter(target => !target.parentElement?.closest(selector));
  if (!targets.length) return () => {};
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const mobile = window.matchMedia("(max-width: 767px)");
  const pending = new Set(targets);
  const visible = new Set<HTMLElement>();
  const running = new Map<HTMLElement, { controls: SlideControls; observer: IntersectionObserver; restore: () => void }>();
  let observer: IntersectionObserver | undefined;
  let animate: SlideAnimate | undefined;
  let loading = false;
  let active = true;
  let failed = false;
  let generation = 0;

  const enabled = () => active && !failed && !document.hidden && !reduced.matches && readEffectsPreference() !== "off";

  function release(target: HTMLElement) {
    const flight = running.get(target);
    if (!flight) return;
    running.delete(target);
    visible.delete(target);
    flight.controls.cancel();
    flight.restore();
    flight.observer.unobserve(target);
    if (!pending.size && !running.size) observer?.disconnect();
  }

  function finish(target: HTMLElement) {
    // complete() puts the native animation at its final visible frame. Its finished
    // promise then releases the native fill and restores any original inline style.
    running.get(target)?.controls.complete();
  }

  function slide(target: HTMLElement) {
    if (!animate || !enabled() || !visible.has(target) || !pending.has(target) || !observer) return;
    pending.delete(target);
    const small = mobile.matches;
    let x = 0;
    let y = small ? 8 : 14;
    let delay = 0;
    if (target.matches(".hero-intro")) { x = small ? -10 : -18; y = small ? 0 : 4; }
    if (target.matches(".hero-index")) { x = small ? 10 : 24; y = 0; delay = small ? .06 : .1; }
    if (target.matches(".selected-copy")) { x = small ? -10 : -18; y = 0; }
    if (target.matches(".project-plate")) { x = small ? 10 : 18; y = 0; delay = small ? .04 : .08; }
    if (target.matches(".career-stop, .skills-group")) {
      const siblings = [...(target.parentElement?.children ?? [])].filter(node => node.matches(".career-stop, .skills-group"));
      delay = Math.min(siblings.indexOf(target), 3) * (small ? .04 : .06);
    }
    const originalTransform = target.style.getPropertyValue("transform");
    const transformPriority = target.style.getPropertyPriority("transform");
    const originalOpacity = target.style.getPropertyValue("opacity");
    const opacityPriority = target.style.getPropertyPriority("opacity");
    const computed = getComputedStyle(target);
    const base = computed.transform || "none";
    const restore = () => {
      if (originalTransform) target.style.setProperty("transform", originalTransform, transformPriority);
      else target.style.removeProperty("transform");
      if (originalOpacity) target.style.setProperty("opacity", originalOpacity, opacityPriority);
      else target.style.removeProperty("opacity");
    };
    try {
      const controls = animate(target, {
        opacity: [.75, Number.parseFloat(computed.opacity) || 1],
        transform: [`translate3d(${x}px, ${y}px, 0)${base === "none" ? "" : ` ${base}`}`, base],
      }, { duration: small ? .38 : .56, delay, ease: [.16, 1, .3, 1] });
      running.set(target, { controls, observer, restore });
      // Native completion also removes this target's control, rather than keeping a
      // growing collection of finished animations for the lifetime of the page.
      void controls.finished.then(() => release(target), () => release(target));
    } catch {
      restore();
      visible.delete(target);
      observer.unobserve(target);
    }
  }

  function beginVisible() {
    if (animate) { visible.forEach(slide); return; }
    if (loading || !visible.size || !enabled()) return;
    loading = true;
    const request = generation;
    void load().then(loaded => {
      if (request !== generation || !enabled()) return;
      loading = false;
      animate = loaded;
      visible.forEach(slide);
    }).catch(() => {
      if (request !== generation || !active) return;
      failed = true;
      sync();
    });
  }

  function sync() {
    if (!enabled()) {
      observer?.disconnect();
      observer = undefined;
      visible.clear();
      generation++;
      loading = false;
      running.forEach((_, target) => finish(target));
      return;
    }
    // Redundant Auto/storage notifications must keep watching running targets for
    // an offscreen exit instead of disconnecting their observer mid-animation.
    if (observer || !pending.size) return;
    const current = new IntersectionObserver(entries => {
      if (observer !== current || !enabled()) return;
      for (const entry of entries) {
        const target = entry.target as HTMLElement;
        if (entry.isIntersecting && pending.has(target)) visible.add(target);
        else if (!entry.isIntersecting) {
          visible.delete(target);
          finish(target);
        }
      }
      beginVisible();
    }, { threshold: .12 });
    observer = current;
    pending.forEach(target => current.observe(target));
  }

  const unsubscribe = subscribeEffectsPreference(sync);
  reduced.addEventListener?.("change", sync);
  document.addEventListener("visibilitychange", sync);
  sync();
  return () => {
    active = false;
    sync();
    unsubscribe();
    reduced.removeEventListener?.("change", sync);
    document.removeEventListener("visibilitychange", sync);
  };
}
