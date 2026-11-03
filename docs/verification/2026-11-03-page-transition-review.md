disposition: ship

Scope: CSS-only cross-document navigation refinement. Reviewed `src/styles/motion.css`, the navigation record in `DESIGN.md`, the transition plan and verification record, and all three named desktop/mobile viewport excerpts. Existing visual design and unrelated behavior are outside this review. No new browser run, build, capture or source modification was performed; functional and budget results below are supplied verification evidence.

## persistence

Pass. The plan, design record and verification record consistently describe native same-origin navigation, finite opacity fades, the mobile duration reduction and progressive fallback. Verification explicitly distinguishes settled screenshots and compressed-file budgets from transition recordings, physical-device performance and an OS reduced-motion test. Publication is still a separate pending action.

## fidelity

| Changed promise | Result | Evidence |
| --- | --- | --- |
| Preserve ordinary navigation | match | The added rules target browser snapshot pseudo-elements only. They introduce no interception, route state, wait or script. Supplied browser verification covers home, archive, project, Back/Forward and fragments. |
| Quiet opacity handoff | match | Old/new root snapshots use opacity keyframes, with 160ms/220ms desktop and 120ms/160ms mobile departure/arrival. Root group animation is disabled, removing default geometry interpolation. |
| Reduced-motion and unsupported-browser fallback | match | The navigation opt-in and snapshot rules are confined to `prefers-reduced-motion: no-preference`. Unsupported rules have no effect on ordinary anchors. OS-toggle and unsupported-engine runs are correctly disclosed as unperformed. |
| Lightweight mobile behavior | match | Durations shorten below 768px; there are no added loops, dependencies or JavaScript. Supplied initial-JS budget is unchanged at 140,367 bytes gzip. This establishes bounded implementation cost, not device FPS. |
| Preserve the settled reading surface | match | The named desktop archive, mobile archive and mobile project excerpts show visible, readable destination content and responsive wrapping. The verification record discloses the transient snapshot-width reading and the subsequent settled width equality. |

## ceiling

Reached for this refinement. A single short root-opacity handoff fits the requested continuity without adding another focal effect. Additional spatial or per-element choreography is outside the agreed scope. Temporal smoothness remains a documented measurement limit rather than a demonstrated device-performance claim.

## material_fixes

None within the changed scope.

## keep

Keep native links and history, conditional CSS opt-in, finite mobile-shortened opacity fades, and the explicit distinction between verified navigation and unmeasured device performance.
