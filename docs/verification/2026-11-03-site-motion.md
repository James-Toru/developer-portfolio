# Site motion refinement

Scope: smooth success-popup and mobile-backdrop entrance/exit; short link, button, arrow, filter, menu and introduction feedback; no link underlines. The existing city stays stationary. Local preview only; no deployment or additional real email.

## Automated verification

- Production build: passed after replacing incomplete IntersectionObserverEntry test casts with complete typed fixtures. Next.js generated the server route and 17 HTML verification pages.
- Full suite: 115 Vitest tests in eight files and five Node verification tests passed (120 total). Contact lifecycle tests cover retained 180ms closing presence, interrupted exit/reopen, Escape/manual/field/timeout dismissal and unmount cleanup. SiteMotion tests cover visible defaults, released observation targets, reduced-motion changes and stale callbacks.
- Static snapshot checker: 17 HTML pages, 13 project pages, 71 referenced internal files, zero errors.
- Asset estimates: maximum initial modern JavaScript 140,367 bytes gzip against 150,000; mobile hero 51,232 bytes against 200,000; conservative homepage mobile estimate 325,412 bytes against 750,000. These are local compressed-file estimates, not measured network or device performance.

## Browser checks

Used an isolated loopback static preview on port 4175 with a temporary mock POST response. No Resend call was made. The normal Next.js preview remains on port 4173 with its existing private configuration.

- Desktop 1280×720: no horizontal overflow; all anchors report no text decoration. Accepted popup is lower-right; backdrop is display:none. Computed entry transitions are opacity 220ms and transform 230ms.
- Mobile 390×844: centered confirmation within the viewport, navy decorative background overlay, no overflow. Manual dismissal removes both nodes after their closing phase. Captures show the settled open state, not a video of the fade.
- Narrow 320×740: no contact or archive overflow. Archive links retain no underline. Websites filter changes the visible count to 3 of 13 at 390px; project navigation works and the project introduction receives its finite animation class.
- Keyboard: contact profile link receives a visible white 2px focus outline; its arrow was sampled mid-transition at approximately 2px, then settled at 5px. Link activation remains usable without a hover pointer.
- Mobile Menu opens with the finite menu-arrive animation and closes on Contact activation. Heading/project introduction classes appear as relevant sections enter view; content is visible beforehand.
- City artwork computed transform remains none. No pointer/parallax code or continuous site-wide loop was added.
- Actual user preview refreshed at 610px, no overflow, new motion stylesheet loaded and link underlines removed. Temporary viewport override reset; temporary QA tab and server closed.

## Evidence and limits

Independent scoped code/visual review: **disposition: ship**, with no material fixes. See [review](2026-11-03-site-motion-review.md). Design rules, component examples and README were reconciled with the implementation.

Viewport excerpts, all from this build:

- [Desktop home](screenshots/2026-11-03/motion-desktop1280.jpg)
- [Mobile home](screenshots/2026-11-03/motion-home-mobile390.jpg)
- [Desktop confirmation, mock success](screenshots/2026-11-03/motion-popup-desktop1280.jpg)
- [Mobile confirmation, mock success](screenshots/2026-11-03/motion-popup-mobile390.jpg)
- [Mobile archive filter](screenshots/2026-11-03/motion-archive-mobile390.jpg)

The browser action tool waited past the brief closing phase before its DOM read; exact 179ms/180ms presence is established by lifecycle tests and source/CSS coordination rather than a captured mid-exit frame. Reduced-motion behavior is checked through unit tests and CSS inspection; OS-level reduced-motion emulation was not performed. Hover rules were inspected with keyboard-focus feedback observed; the browser tool does not expose a hover action. No physical lower-tier-device, FPS, Lighthouse or actual zoom claim is made. Browsers without @starting-style retain an immediate popup entrance and smooth exit fallback.
