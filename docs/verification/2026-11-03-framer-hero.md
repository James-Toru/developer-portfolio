# Framer Motion entrances and raised hero

The owner requested Framer animations with sliding/easing and a higher hero that fits the screen. Framer Motion 14.9.0 is pinned in package/lockfile. Only its mini DOM animation API is imported dynamically, after a visible eligible target is found. The separate deployment build/local verification commands are preserved.

## Behavior

Hero identity and featured index arrive from opposite short horizontal directions; project images/copy have complementary slides. Section headings, skills groups and career milestones rise gently once. Parent and child are not both revealed. Native Web Animations use full transform/opacity keyframes and cubic-bezier(.16,1,.3,1); desktop duration is 560ms with at most 24px travel, mobile 380ms with at most 10px travel. Stagger is capped at 180ms. No initial hidden styles, form movement, scroll interception or continuous Framer loop is introduced.

Off, reduced motion, hidden tabs and offscreen exits settle running arrivals. Finished controls/observation are released; original inline transform/opacity values and priorities are restored. Stale imports and unmounts cannot start later animation. Missing Web Animations/observation or a failed optional import leaves static visible content. The existing signal/diamond/name controller remains intact.

Hero padding and display sizing use viewport height. Desktop minimum height subtracts the actual 77px header including its border; mobile subtracts 73px. This is a minimum rather than a clipping height. Featured work stays in normal flow below the mobile introduction. A long CargoForward360 title found during review now wraps within its own grid cell.

## Evidence

- Frozen lockfile install and pnpm supply-chain checks passed. Offline validation initially lacked cached registry metadata; the normal frozen install succeeded without changing resolutions.
- Production build:verify passed, generating 17 verification HTML pages including 13 project pages. Static checker reported zero errors.
- Full tests passed: 155 Vitest + 6 Node tests. New controller tests cover async loading, once-only observation, preference changes, hidden/offscreen exits, cleanup, redundant Auto notifications, style restoration, bounded mobile travel and optional failures.
- Asset budgets pass: maximum initial JavaScript 142,417 bytes gzip; mobile hero 51,232 bytes; conservative homepage transfer estimate remains below 332KB. The optional Framer chunk is excluded from initial scripts, as described by the measurement methodology.
- At 1440×900, hero bottom moved from 940.8px to exactly 900px; name top moved from 350.6px to 225.6px, and main actions end at about 711px. Hero also ends exactly at the viewport at 1366×768 and 1024×600, with both actions and Effects visible.
- At 390×844, actions end near 540px and Effects near 598px. At 320×568, actions end near 504px and Effects near 562px. Tablet 768×1024 keeps them near 582/640px. In 844×390 landscape, actions end near 356px and Effects follows naturally below the first view. No horizontal overflow was found at these six sizes.
- Browser console contained no errors. Settled project targets had no residual inline transforms and full opacity. Effects Off removed all signal classes and left no temporary transforms. The browser automation read scope cannot list Web Animations directly; temporal lifecycle verification uses the focused tests and live computed-style inspection. Still captures show the readable settled composition.

Local captures under ignored tmp/framer-hero include desktop.png, mobile.png, compact-mobile.png and short-desktop.png. An independent code/visual review found one title overlap at 1024×600; after the wrap fix, the same capture was refreshed and the reviewer closed the finding with ship. All three title cells then had matching client/scroll widths of 123px.

No real email was sent, and no physical-device or throttled performance claim is made. No deployment was requested for this refinement; the local preview remains available.
