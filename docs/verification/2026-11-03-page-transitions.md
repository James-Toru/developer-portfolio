# Page navigation transitions

The existing ordinary anchors now opt into same-origin cross-document View Transitions through shared CSS. Root snapshots use opacity only; the default group size/position animation is disabled. Arrival/departure are 220ms/160ms on desktop and 160ms/120ms at 767px and below. There is no JavaScript addition, link interceptor, synthetic navigation wait, transition package or background movement.

Reduced motion leaves the opt-in inactive. Unsupported browsers retain ordinary navigation. Fragment-only navigation, external links and downloads retain browser behavior. Primary guidance: [MDN @view-transition](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@view-transition) and [Chrome cross-document transitions](https://developer.chrome.com/docs/web-platform/view-transitions/cross-document). Installed Next.js 16.4.3 navigation and ViewTransition guidance was read; its React integration was unnecessary for the existing full-document links.

## Verification

- Production build and TypeScript check passed. Full suite: 115 Vitest and five Node verification tests passed. Styling uses browser QA rather than implementation-mirroring unit tests.
- Static checker: 17 pages, 13 projects, 71 internal files, zero errors.
- Initial JS remains 140,367 bytes gzip, unchanged from the prior build and below 150,000. Mobile hero remains 51,232 bytes; conservative mobile page estimate is 325,525 bytes below 750,000. These are compressed-file estimates, not physical-device performance measurements.
- Browser desktop1280: keyboard Work activation reaches the archive; LawPro360 opens its detail. Browser Back/Forward return to the expected archive/project; the logo returns home.
- Browser mobile390: homepage section link remains an in-document fragment. View all projects → archive → LawPro360 → next DOLMIS → Back to work all reach the expected routes. Browser Back restores DOLMIS and the logo returns home; Let's talk reaches the contact anchor. No form was submitted and no email sent.
- Compiled CSS is parsed by the preview browser with navigation:auto inside the no-preference media query. Computed root pseudo-element names are page-arrive/page-depart; desktop durations220/160ms, mobile160/120ms; group animation is none. Native view-transition-name support is reported.
- Settled desktop/mobile pages have no horizontal overflow. A read immediately after a mobile route commit temporarily reported snapshot width beyond the scrollbar-reduced client width; the subsequent settled read had scrollWidth=clientWidth=375, no offending content elements and clear screenshots.

## Captures and limits

Independent scoped visual/code review: **disposition: ship**, no material issues. See [review](2026-11-03-page-transition-review.md). The actual user preview was refreshed at 610px with the shorter fade and no overflow; temporary viewport overrides were reset and the QA tab closed.

Viewport excerpts show settled destination pages, not a recording or intermediate fade frame:

- [Desktop archive](screenshots/2026-11-03/page-transition-archive-desktop1280.jpg)
- [Mobile archive](screenshots/2026-11-03/page-transition-archive-mobile390.jpg)
- [Mobile project](screenshots/2026-11-03/page-transition-project-mobile390.jpg)

The browser's read-only automation surface does not expose document.getAnimations, so mid-transition timing was not instrumented. Reduced-motion fallback is verified by source/media scoping, not an OS preference toggle. No actual mobile-device FPS, slow-network trace, unsupported-engine run or video capture is claimed. Native engines may skip a transition (for example when navigation takes too long); content and navigation remain independent of it.

## GitHub publication preparation

Owner requested https://github.com/James-Toru/developer-portfolio.git. Initial ls-remote succeeded with no refs. Read-only credential-pattern checks across 23 historical commits found no candidate key files; only the blank .env.example is tracked in environment-file history, and .env.local remains ignored. This scoped check is not a general security audit. Repository visibility and hosting are unchanged.
