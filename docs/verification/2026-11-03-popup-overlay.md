# Mobile confirmation overlay — 2026-11-03

The owner requested a low-opacity background overlay while the mobile confirmation is visible, with desktop unchanged. The confirmation now mounts a decorative sibling backdrop. CSS hides it by default and shows it only at 767px and below: full viewport, `rgba(2, 8, 16, 0.28)`, z-index 79 below popup 80, no pointer interception or blur. It shares the popup's mount/unmount lifecycle; no additional state, timer or focus behaviour was added.

Production build/TypeScript passed. Existing complete tests passed: 107 Vitest and five Node fixtures. No new tests were added for this reversible visual change; actual browser checks verified the requested lifecycle. Static checker passed: 17 HTML mappings, 13 projects, 71 files, no errors. Existing size budgets passed: initial JS 139,827 bytes gzip, mobile hero 51,232 bytes, conservative mobile homepage 324,139 bytes.

Actual browser checks used build assets with mocked success on loopback port 4175; no email was sent. At 390×844, the backdrop covered the entire 375×844 document viewport, at z79 below popup80, with computed alpha 0.28 and no horizontal overflow. Clicking Dismiss removed both nodes. A subsequent mock confirmation followed by a 5.5-second timed wait also removed both nodes and retained inline status. At 1280×720, the backdrop computed to display:none and document client/scroll widths matched 1265px. Both captured viewport excerpts were inspected:

- `screenshots/2026-11-03/popup-mobile-overlay-390.jpg`
- `screenshots/2026-11-03/popup-desktop-no-overlay-1280.jpg`

Viewport overrides were reset, the mock server/tab were closed and the main preview refreshed. Existing nonmodal focus and dismissal behaviour is preserved. The [finish reviewer](reviews/2026-11-03-popup-overlay-visual.md) returned `ship` with no material fixes, and the [documenter](reviews/2026-11-03-popup-overlay-documenter.md) verified the scoped design rules and removed one stale backdrop prohibition. Physical-device and screen-reader end-to-end evidence remains outside these checks.
