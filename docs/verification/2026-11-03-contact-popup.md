# Contact success popup — 2026-11-03

The owner confirmed receipt of the previous live test email and requested a more appealing cyberpunk success popup. This refinement preserves the Midnight Network palette, fonts, form and Resend endpoint.

## Implemented behaviour

A nonmodal, bottom-right confirmation appears only after a successful accepted submission. It uses the existing navy/cyan palette, opposing cut corners, Barlow Condensed heading, Exo 2 body, an authored SVG check and a 220ms entrance/280ms check animation. Both animations are disabled under reduced motion. There is no auto-dismiss deadline, overlay backdrop, focus trap, continuous animation or added dependency.

The 44px close control and Escape dismiss it. Keyboard focus inside the popup returns to the submit action on dismissal. Returning to any input/textarea dismisses the popup without moving focus or erasing the new draft, preventing it from obscuring continued editing on a small phone. A new valid submission also removes stale success feedback. The original live status remains available to assistive technology; the inline success is visually restored after the popup closes. Copy says Message sent/on its way, rather than claiming provider-confirmed inbox delivery.

## Verification

Five new component behaviours were tested: accepted-only nonmodal display, explicit dismissal/inline retention, Escape/focus recovery, field re-entry/draft preservation and removal on a later failed submission. Initial tests showed four missing-popup failures; the added mobile focus behaviour first failed before implementation. Final focused suite has 18 passing tests.

Final production build and TypeScript check passed. Complete suite: **105 Vitest tests across seven files plus five Node fixtures**, all passed. Static checker: 17 HTML mappings, 13 project pages, 71 files, errors []. Whitespace check passed with normal CRLF notices.

[Asset measurements](asset-sizes-2026-11-03-contact-popup.json): maximum modern initial JavaScript 139,783 bytes gzip; mobile hero 51,232 bytes; conservative mobile homepage 324,020 bytes. All existing budgets pass. No field, CPU or network-performance claim is made.

## Actual browser review

Visual QA used a temporary, loopback-only server on port 4175 serving the actual current build and mocking the contact response. It never calls Resend. This mock server/helper is unshipped, lives under ignored `tmp/`, and is stopped after QA. The real Next.js preview on port 4173 retains its existing Resend configuration. No additional real email was sent during this refinement.

Two bounded inspection passes were used. The first exposed the need to dismiss on field re-entry on small screens; the second confirmed that behaviour and captured the final build. All four saved captures were viewed and show the complete popup in page context; they are viewport excerpts, not whole-page or whole-form captures:

- `screenshots/2026-11-03/popup-desktop-1280.jpg`
- `screenshots/2026-11-03/popup-normal-610.jpg`
- `screenshots/2026-11-03/popup-mobile-390.jpg`
- `screenshots/2026-11-03/popup-mobile-320.jpg`

No horizontal overflow: document clientWidth/scrollWidth matched at 1280 (1265px), 610 (595px), 390 (375px) and 320 (305px). The 320×568 popup was 273×196px with 16px edge clearance; at 390×844 it was 343×140px. Actual browser checks confirmed field re-entry dismissal, Escape dismissal, inline success retention and submit focus recovery. Viewport overrides were reset. Reduced-motion handling was inspected in CSS; changing the owner's OS preference was outside this test. Physical-device and screen-reader end-to-end testing remain unverified.

The [fresh scoped finish review](reviews/2026-11-03-contact-popup-visual.md) returned `ship` after inspecting all four captures, the source diff and lifecycle tests. It found no material visual, accessibility lifecycle or code issue within this refinement. The [documenter](reviews/2026-11-03-contact-popup-documenter.md) added the scoped popup rule to DESIGN.md and its sidecar, verified JSON and preserved the existing palette/type primitives. The temporary mock server and tab have been closed, and the real local preview has been refreshed.
