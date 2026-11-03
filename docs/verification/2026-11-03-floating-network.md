# Floating network and copyright footer

Owner requested interactive floating body background like [saidk.io](https://saidk.io/) plus copyright/year and removal of the footer tagline. Reference inspected in the browser: drifting dots with fine proximity links. Implemented an original cyan canvas network within the existing Midnight Network palette; no external assets or application code copied. City artwork remains stationary, and opaque contact/reading surfaces retain their grounds.

## Behavior and resource bounds

The transparent, aria-hidden fixed canvas sits behind content and has pointer-events:none. A small lazy-loaded native2D controller draws a proximity network with slow drift; fine-pointer proximity adds gentle displacement bounded18px. It adds no dependency, WebGL or external service. Draw limits are48nodes/30fps/DPR≤1.5 on desktop,20nodes/15fps/DPR≤1 on compact/coarse-pointer layouts, with backing-store area≤4million pixels. RAF callbacks may occur at the screen refresh rate; actual drawing is throttled. Hidden documents cancel scheduled frames; reduced motion draws one static constellation. Off hides decoration and destroys the controller. Existing control/confirmation animations remain available.

Hero and footer Auto/Off controls share a small preference store. Successful writes use local storage; denied writes retain the selection in memory; subscriptions synchronize controls and respond to storage events. Footer controls are available on all pages. The footer shows “©2026 James Gatoru. All rights reserved.” using the current build year, with the old tagline removed.

## Verification

- Controller TDD:10 expected failures and1passing null-context case on scaffold; final11/11 focused tests passed. They cover bounded painted-frame rate, node/pixel caps, pointer offset/touch exclusion, static mode without RAF, hidden suspension/resume, resize and teardown.
- Shared preference TDD:2 expected failures against scaffold, then2/2 passed. Integration initially exposed four existing hero test failures from a stale memory override and one TypeScript inference issue. Successful storage writes now release the memory override, and the external-store snapshot uses an explicit preference type. The affected hero/preference subset passes8/8.
- Final full suite:128 Vitest tests across10files and5Node verification tests passed,133total. Production build and TypeScript passed. Static checker17pages/13projects/76internalfiles,0errors.
- Compressed-file budgets pass: maximum initial JS140953bytes gzip below150000; mobile hero51232bytes below200000; conservative mobile estimate324148bytes below750000. These are file estimates, not measured network or physical-device performance.
- Desktop1280 archive: canvas running with48nodes,1265×720 backing store at this device ratio, behind content and input-transparent; no overflow. Websites filter works and shows3of13. A native pointer click in blank background was exercised; exact visual trajectories were not instrumented.
- Footer Off immediately hides canvas and removes its controller state. On home, choosing footer Off synchronizes both hero/footer pressed states and hides decoration. Auto restarts it. Keyboard Enter activates footer Auto.
- Mobile390: running20nodes,375×844 backing store, no overflow. Mobile320 also retains20nodes with no overflow. Footer wraps readably with copyright and controls. No form submission or email send occurred.

## Captures and limits

All are settled viewport excerpts:

- [Desktop network](screenshots/2026-11-03/floating-network-archive-desktop1280.jpg)
- [Mobile network](screenshots/2026-11-03/floating-network-archive-mobile390.jpg)
- [Desktop footer with Effects Off](screenshots/2026-11-03/floating-footer-desktop1280.jpg)
- [Mobile footer with Effects Off](screenshots/2026-11-03/floating-footer-mobile390.jpg)

Stills verify composition, not frame smoothness. Reduced-motion, hidden-tab lifecycle, touch exclusion and denied storage are covered by unit/source checks, not OS preference toggling or a physical low-tier device. No FPS, GPU, Lighthouse, slow-network or battery claim is made. There is no guarantee that all48nodes have links at once; proximity links change as the nodes drift. Canvas failure leaves the page readable. Temporary viewports and reference/QA tabs were cleared; the local preview remains available. No push or deployment was requested for this refinement.

Independent scoped code/visual review: **disposition: ship**, no material fixes; [review](2026-11-03-floating-network-review.md). The earlier user tab was no longer open at handoff; a fresh archive preview was opened and retained as the deliverable.
