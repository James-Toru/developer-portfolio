# Return signal

Owner requested a subtle, unique back-to-top control. Implemented an original angular navy/cyan beacon with authored upward arrow, TOP label and a perimeter that traces actual scroll progress. It appears after max(400px,65%viewport height), has a56×64px hit area, fades near the top and moves the arrow a few pixels on hover/focus. No library or decorative loop.

Scroll/resize events are passive and coalesced into one requested frame. The SVG progress style updates without a React render on each scroll; visibility changes only across the threshold. Optional body ResizeObserver handles content-height changes. Unmount cancels frames/listeners/observation and ignores delayed observer callbacks. Activation focuses the existing main landmark with preventScroll and then uses native smooth return to y0; the live reduced-motion preference switches to instant scrolling. CSS removes reduced-motion travel/transitions. Footer CV-link margin reserves72px; the control hides while the success popup is present.

## Verification

- TDD: four expected failures against null scaffold, then four passing. An additional idle-unmount observer test exposed one expected failure; active-lifecycle guard fixed it. Final full suite passed133Vitest tests and5Node tests,138total, including all five return-control cases.
- Production build and TypeScript passed. Static checker17pages,13projects,76internalfiles,0errors. Budgets pass: maxinitialJS141473bytes gzip/150000, mobilehero51232/200000, conservative mobile325227/750000. These are compressed-file estimates, not measured device performance.
- Desktop1280: hidden/disabled at y0; visible after scroll792 with corresponding partial perimeter; keyboard Enter returns to y0 and focus main-content. Initial visual inspection placed the control close to an archive label; moved to the outer8px edge and recaptured after rebuilding.
- Mobile390:56×64px button, no overflow; at the bottom the perimeter completes and the CV link is clear. Native click returns to exact y0, focuses main-content and hides the control. Intermediate reads occurred during native smooth scrolling; final verification explicitly waited for progress100/top state rather than treating an intermediate frame as completion. Mobile320 has no overflow.
- Desktop/mobile footer captures show clearance. CSS :has popup selector is supported by the preview browser. The popup-priority rule is source-verified; no new form submission or real email was used to trigger a popup. OS reduced motion is tested through behavioral mock/CSS inspection, not a system preference toggle.

## Captures

Settled viewport excerpts:

- [Desktop archive/control](screenshots/2026-11-03/return-signal-desktop1280.jpg)
- [Desktop footer clearance](screenshots/2026-11-03/return-signal-footer-desktop1280.jpg)
- [Mobile footer/control](screenshots/2026-11-03/return-signal-mobile390.jpg)

No animation recording, physical-device FPS, zoom or colour-vision simulation is claimed. Source/geometry and browser state establish behavior; stills establish the visual design. Local preview only; no push requested for this refinement.

Independent scoped code/visual review: **disposition: ship**, no material issues; [review](2026-11-03-return-signal-review.md). Preview tab25 refreshed with the new control and retained; temporary QA tabs and viewport overrides cleared. User's other tab was left alone.
