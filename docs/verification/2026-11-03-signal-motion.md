# Toolchain signals and current-role pulse

The owner explicitly requested movement along the Skills rules and a pulse on the current experience diamond. This refinement supersedes the earlier static-marker direction while preserving the layout and factual content.

Motion thesis: treat squares as slow network signals and the current role as a live milestone. Five small pseudo-elements use staggered seven-second alternating horizontal transforms, bounded to 64–160px; one diamond uses a 3.6-second scale/opacity pulse. No layout-driving animation, shadow/filter animation, dependency or per-frame JavaScript is added.

The existing SiteMotion client enhancement observes each skill group and the current milestone. Motion runs only while the target intersects the viewport, the document is visible, Effects is Auto and reduced motion is absent. Off, hidden tabs, reduced motion and offscreen targets return to the static marker. Cleanup disconnects the observer and releases subscriptions/listeners/classes; stale callbacks cannot restart motion. Without IntersectionObserver or scripting, static markers remain visible. CSS also independently disables these loops under reduced motion.

Fresh verification:

- The two new lifecycle tests failed before implementation, then passed. Full suite: 136 Vitest + 5 Node tests pass. Cases cover visibility, hidden tabs, initial/live reduced motion, Effects Off/Auto, cleanup and stale callbacks.
- Production build and static checker pass: 17 HTML pages, 13 project pages, zero errors.
- Asset budgets pass: maximum initial JavaScript 141,650 bytes gzip; mobile hero 51,232 bytes; conservative homepage mobile estimate 328,827 bytes.
- Browser inspection at desktop 1440×1000 confirmed all five square transforms change while Skills is visible, and no Skills signal remains active while viewing Experience. Only the current diamond has the pulse animation, with its rotation preserved. Effects Off removed every signal animation; Auto restored visible targets.
- At 390×844, only the two intersecting Skills groups were active; the remaining groups stayed static. The current-role pulse ran on mobile, with no horizontal overflow. Local captures are in ignored tmp/signal-motion/desktop.png, desktop-career.png, mobile.png and mobile-career.png.
- An independent read-only reviewer inspected the source and four captures and returned ship with no material findings.

These are local lifecycle, geometry and browser checks; physical-device and throttled performance measurements were not performed. No real email was sent.
