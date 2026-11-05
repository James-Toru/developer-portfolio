export type NetworkSettings = { animate: boolean; interactive: boolean; compact: boolean };

type Node = { x: number; y: number; vx: number; vy: number; ox: number; oy: number };

export function mountFloatingNetwork(canvas: HTMLCanvasElement, initialSettings: NetworkSettings): { update(settings: NetworkSettings): void; destroy(): void } | undefined {
  const context = canvas.getContext("2d", { alpha: true });
  if (!context) return;
  const ctx = context;
  let settings = initialSettings;
  let nodes: Node[] = [];
  let width = 1;
  let height = 1;
  let frame: number | null = null;
  let lastPaint: number | null = null;
  let pointer: { x: number; y: number } | null = null;
  let destroyed = false;

  function cancelFrame() {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
    lastPaint = null;
  }

  function size() {
    const oldWidth = width;
    const oldHeight = height;
    width = Math.max(1, document.documentElement.clientWidth || window.innerWidth);
    height = Math.max(1, window.innerHeight);
    const ratio = Math.min(window.devicePixelRatio || 1, settings.compact ? 1 : 1.5, Math.sqrt(4_000_000 / (width * height)));
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    nodes.forEach((node) => { node.x *= width / oldWidth; node.y *= height / oldHeight; });
    const count = settings.compact ? 20 : 48;
    nodes = nodes.slice(0, count);
    while (nodes.length < count) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 5;
      nodes.push({ x: Math.random() * width, y: Math.random() * height, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, ox: 0, oy: 0 });
    }
    canvas.dataset.networkNodes = String(nodes.length);
  }

  function paint(delta = 0) {
    ctx.clearRect(0, 0, width, height);
    // Give wide screens broader constellations without adding particles or frames.
    const reach = settings.compact ? 165 : Math.min(360, Math.max(240, width * 0.2));
    const radius = settings.compact ? 1.55 : 2.2;
    const lineOpacity = settings.compact ? 0.22 : 0.3;
    for (const node of nodes) {
      node.x = (node.x + node.vx * delta + width) % width;
      node.y = (node.y + node.vy * delta + height) % height;
      let ox = 0;
      let oy = 0;
      if (pointer) {
        const dx = node.x - pointer.x;
        const dy = node.y - pointer.y;
        const distance = Math.hypot(dx, dy);
        if (distance > 0 && distance < 140) {
          const force = 18 * (1 - distance / 140) / distance;
          ox = dx * force;
          oy = dy * force;
        }
      }
      const ease = delta ? 1 - Math.exp(-delta * 8) : 0;
      node.ox += (ox - node.ox) * ease;
      node.oy += (oy - node.oy) * ease;
    }
    ctx.lineWidth = settings.compact ? 0.8 : 1;
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const distance = Math.hypot(a.x + a.ox - b.x - b.ox, a.y + a.oy - b.y - b.oy);
        if (distance >= reach) continue;
        ctx.strokeStyle = `rgba(83, 184, 201, ${lineOpacity * (1 - distance / reach)})`;
        ctx.beginPath();
        ctx.moveTo(a.x + a.ox, a.y + a.oy);
        ctx.lineTo(b.x + b.ox, b.y + b.oy);
        ctx.stroke();
      }
      ctx.fillStyle = `rgba(112, 205, 216, ${settings.compact ? 0.58 : 0.68})`;
      ctx.beginPath();
      ctx.arc(a.x + a.ox, a.y + a.oy, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function tick(time: number) {
    frame = null;
    if (destroyed || document.hidden || !settings.animate) return;
    if (lastPaint === null) lastPaint = time;
    const elapsed = time - lastPaint;
    if (elapsed >= 1000 / (settings.compact ? 15 : 30)) {
      paint(Math.min(elapsed / 1000, 0.08));
      lastPaint = time;
    }
    frame = requestAnimationFrame(tick);
  }

  function start() {
    cancelFrame();
    canvas.dataset.networkState = document.hidden ? "paused" : settings.animate ? "running" : "static";
    if (document.hidden) return;
    paint();
    if (settings.animate) frame = requestAnimationFrame(tick);
  }

  function onPointerMove(event: PointerEvent) {
    if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
    pointer = { x: event.clientX, y: event.clientY };
  }

  function onPointerLeave() { pointer = null; }

  function removePointerListeners() {
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerleave", onPointerLeave);
    window.removeEventListener("pointercancel", onPointerLeave);
    window.removeEventListener("blur", onPointerLeave);
  }

  function onResize() { size(); start(); }
  function onVisibility() { pointer = null; start(); }

  function update(next: NetworkSettings) {
    if (destroyed) return;
    removePointerListeners();
    pointer = null;
    settings = next;
    nodes.forEach((node) => { node.ox = 0; node.oy = 0; });
    if (settings.animate && settings.interactive && !settings.compact) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerleave", onPointerLeave, { passive: true });
      window.addEventListener("pointercancel", onPointerLeave, { passive: true });
      window.addEventListener("blur", onPointerLeave);
    }
    size();
    start();
  }

  window.addEventListener("resize", onResize, { passive: true });
  document.addEventListener("visibilitychange", onVisibility);
  update(initialSettings);
  return {
    update,
    destroy() {
      if (destroyed) return;
      destroyed = true;
      cancelFrame();
      removePointerListeners();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      delete canvas.dataset.networkState;
      delete canvas.dataset.networkNodes;
    },
  };
}
