# Popup positioning and timing — documenter verification

Disposition: aligned. Bounded review of Contact Band and The Accepted Success Rule after the scoped ship review.

Checked `src/components/contact-confirmation.tsx`, `src/components/contact-form.tsx`, `src/styles/contact.css`, the corresponding `DESIGN.md` section and `.impeccable/design.json` entries, `README.md`, `docs/verification/2026-11-03-popup-timing.md` and `docs/verification/reviews/2026-11-03-popup-timing-visual.md`. No browser, tests, real email or Git mutations were performed by this pass; runtime results remain the supplied verification evidence.

The recorded system matches mobile centring at 767px and below, lower-right placement above that boundary and automatic dismissal after 5,000ms at all widths. Entrance keyframes retain the mobile translation, including the static reduced-motion state. The stable dismissal callback and effect cleanup support one timer per appearance. The Accepted Success Rule matches verbatim between DESIGN.md and the sidecar; manual dismissal, conditional focus recovery and retained inline/live feedback remain accurately recorded.

Files changed: `DESIGN.md` (removed the stray space in “padding ;” only) and this report. Token primitives, component previews, sidecar metadata and README remain unchanged.

System summary:

1. Palette: existing navy ground, cobalt contact band, cyan edges and muted supporting text.
2. Type ramp: Barlow Condensed display; Exo 2 body and controls; popup heading 2.2rem, reducing to 1.9rem at 480px and below.
3. Shape: square fields and opposing clipped popup corners retain the incumbent angular language.
4. Responsive rule: popup centres horizontally and vertically at 767px and below; wider viewports retain lower-right placement.
5. Accepted Success Rule: accepted-response-only popup, five-second lifetime, manual dismissal, conditional focus recovery and persistent inline/live confirmation.

Not canonized or repaired: previously reported PRODUCT live-verification history drift remains outside this narrowly authorized positioning/timing record check. No new system rule or defect value was introduced.
