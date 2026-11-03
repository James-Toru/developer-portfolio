# Return signal control

Owner requested a subtle, unique back-to-top button. Extend the existing clipped-corner navy/cyan language with a small angular return beacon, authored upward-arrow SVG and TOP label. Its perimeter fills with real scroll progress; no decorative loop or new library. Appear only after a meaningful scroll, fade away near the top, and move the arrow slightly on hover/focus. The perimeter is functional navigation feedback, not a dashboard ornament.

- [x] Implement a shared client button with coalesced passive scroll/resize updates and optional body ResizeObserver. No idle RAF loop. Native smooth scroll returns to y0 and focuses the existing main landmark without an intermediate jump; reduced motion returns instantly.
- [x] Style opaque navy, faint cyan edge/progress, clear keyboard focus and minimum48px touch target. Reserve footer CV-link clearance and hide while the existing success popup is present, preserving its priority.
- [x] Behavioral tests for threshold/progress, smooth/reduced return/focus and listener/observer/frame cleanup; full build/checks and desktop/mobile inspection. Update design rules and record actual evidence.
- [x] Scoped review, commit locally with the configured James Gatoru identity, leave preview available. No push requested.
