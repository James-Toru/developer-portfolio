# Floating network and footer refinement

Owner requested interactive floating body-background animation similar to saidk.io and a copyright/year footer replacing the old tagline. Reference inspected visually: drifting particles with fine proximity links. Retain Midnight Network artwork, CV navy and cyan palette, typography and responsive reading surfaces.

## Motion thesis

The new background expresses the portfolio's network theme through a sparse cyan constellation in the open navy reading areas. Nearby nodes join with fine, faint lines; desktop pointer proximity gently displaces nodes. Content and the city never move. No copying of reference artwork, copy or application code.

The viewport-sized transparent 2D canvas sits behind content and cannot receive input. Desktop is bounded to48 particles/30 drawn frames per second and capped1.5 pixel ratio; mobile/coarse pointer uses20 particles/15fps and pixel ratio1. No libraries, WebGL, glow filters or blur. Hidden tabs cancel frame work; reduced motion draws a static constellation. Existing Effects Auto/Off becomes site-wide through a small shared preference store and change notification. Off clears/unmounts decoration, including when storage is denied. Reading and interaction work without scripting or canvas support.

## Work

- [x] Implement a bounded canvas controller and meaningful lifecycle tests: frame throttling, pointer/touch policy, hidden-tab suspension, resize bounds, reduced/static and Off/unmount cleanup.
- [x] Integrate the client enhancement, shared Effects preference and transparent background layering; preserve opaque city/contact surfaces and visible text. Add footer copyright with current year and James Gatoru; remove the old tagline. Keep control usable on archive/detail routes through a footer Effects control.
- [x] Build, suite, static and compressed-asset checks. Inspect desktop/mobile, effect controls, original motion policy, links and form usability without sending email. Capture actual renders and disclose animation/performance limits.
- [x] Scoped independent review and design/README reconciliation. Local commit using James Gatoru <jimmyj00100@gmail.com>; no push/deployment requested for this refinement.
