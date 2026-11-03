# Mobile popup positioning and timeout — 2026-11-03

The owner requested centring on mobile only and automatic dismissal after five seconds. At 767px and below the existing popup now uses 50% top/left and a -50% translation; desktop retains its bottom-right placement. Entrance keyframes respect the centring translation. A stable dismissal callback and cleaned-up 5,000ms timer provide one timeout per appearance. Earlier close/Escape/editing paths and inline/live confirmation remain available.

Two new fake-clock tests failed before implementation, then passed: the popup remains at 4,999ms and closes at 5,000ms with inline confirmation/focus recovery; a manually dismissed popup cannot prematurely close the next appearance. The retry fixture was corrected to return a fresh Response for each request. Final component suite: 20 passed. Complete suite: 107 Vitest tests and five Node fixtures, all passed. Production build/TypeScript and static checker passed (17 HTML mappings, 13 projects, 71 files, no errors). Asset budgets passed: initial JS 139,813 bytes gzip, mobile hero 51,232 bytes, conservative mobile homepage 324,092 bytes.

Browser QA used actual build assets on an isolated mock-success server at loopback port 4175. No email was sent. At 390×844, the popup centre measured x187.5/y422, exactly half the 375px document width and 844px viewport height; clientWidth/scrollWidth both375. At 1280×720, desktop remained 38.39px from the document's right edge and 24px above the bottom; clientWidth/scrollWidth both1265. Both saved viewport excerpts show the complete popup:

- `screenshots/2026-11-03/popup-centered-mobile-390.jpg`
- `screenshots/2026-11-03/popup-timed-desktop-1280.jpg`

An initial mobile screenshot attempt occurred after the timeout and was retried within one tool call. The saved capture was opened and inspected. A tool selector wait for disappearance timed out, but a subsequent actual DOM check confirmed the popup gone with inline confirmation retained; the exact 5,000ms boundary is established by the fake-clock tests. No application error or extra send was inferred from the tool timeout. Viewport overrides were reset. Physical devices and screen-reader end-to-end behaviour remain unverified.

The [scoped finish review](reviews/2026-11-03-popup-timing-visual.md) returned `ship`, with no material visual or lifecycle fixes. The [documenter](reviews/2026-11-03-popup-timing-documenter.md) confirmed matching position/time rules and corrected one punctuation issue; primitive tokens were preserved. The sidecar's prior ASCII escaping was retained without changing parsed data. The temporary mock server/tab were closed and the real preview refreshed.
