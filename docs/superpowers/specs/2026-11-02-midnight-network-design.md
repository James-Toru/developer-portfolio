# Midnight Network portfolio design

Date: 2026-11-02
Status: Approved by the owner on 2026-11-02; implementation planning in progress.

## Intent and decisions

James Gatoru needs a distinctive developer portfolio primarily for prospective clients and occasionally employers. Visitors should understand his capabilities, inspect real work and contact him. The initial collection comes from both supplied CVs and the public James-Toru GitHub account; other projects can be added later.

Confirmed by the owner:
- Choose the Midnight Network Cyberpunk concept, concepts/cyberpunk-midnight-network-v2.png.
- Use deep navy, blue and cyan rather than acid yellow.
- Make it sufficiently immersive with reactive animation while preserving performance on mobile and lower-tier devices.
- Put strong emphasis on full responsiveness.
- Use layered city artwork with lightweight reactive effects, rather than an optional 3D scene.
- Contact email: gatorumbugua@gmail.com.

The implementation choices below were approved with this brief. The owner subsequently requested https://github.com/James-Toru/raxos-website as an implementation reference; the selected Midnight Network visuals and responsiveness/performance requirements remain authoritative.

## Goals and limits

The first viewport must communicate name, software development and agentic AI expertise, selected work and a contact route. The experience must preserve its identity on phones and remain useful with decorative motion disabled. All CV projects and public repositories must be represented accurately, while selected work receives greater depth.

First-release limits: no 3D renderer, video background, forced intro, simulated operating system, scroll interception, audio, login, database, CMS or message-sending backend. Use a direct email action and LinkedIn rather than a form that appears to submit without a service. No invented metrics, testimonials, availability or project responsibilities. The Summer Hikaru Died exploration remains archived and is outside the active design.

## Approaches considered

1. Layered city artwork, native CSS transitions and small event-driven effects: chosen by the owner. Preserves the illustrated city and interface character with a predictable base experience and limited animation work.
2. Optional real-time 3D city on capable devices with an artwork fallback: more spatial freedom but heavier assets, additional rendering code and more tuning across devices. Not selected.

Framework recommendation: Next.js App Router with TypeScript and a static export, native CSS and limited client components. Routes and project content are rendered to HTML at build time. This matches the owner's React/Next.js background and supports shareable project pages. Use locally maintained structured content, not runtime GitHub calls. Adding a project should require one content record and any images, followed by a rebuild. The exact compatible dependency versions are chosen during implementation.

Static export requires pre-generated project routes and pre-optimized local image variants; do not rely on the default server image optimizer. No hosting account or paid service is required to review a local build. Deployment/domain selection happens separately when requested.

## Visual identity

Visual authority is the selected Midnight Network image. It establishes a rain-lit futuristic city, near-black/navy surfaces, ice-white display type, restrained cyan edge details, cobalt action areas and a very small coral signal accent.

Starting tokens, to be checked for contrast in implementation:
- Background #06121F; raised surface #0B1B2B.
- Text #EAF3FA; secondary text #AFBDCB.
- Cobalt #1357F5; cyan #29DCE8; coral #F56F68.
- Use white text on cobalt actions and dark text on cyan fills where contrast requires it.
- Name uses an obtainable licensed condensed italic display face close to the concept. Body is a readable sans; tiny labels may use a monospace face. At most two font families, locally served WOFF2 subsets and limited weights.
- Angular clipped action corners and thin cyan rules establish the interface language. Do not frame every paragraph or make the page a dashboard.
- The hero city carries detailed imagery; long text uses calm opaque surfaces.
- All visible text and controls must be real HTML. Never ship a full mockup screenshot as a website background.
- Produce original isolated city artwork and project illustrations as needed. Mockup crops are compositional references, not shipping artwork. Do not re-create a rain-lit city with decorative CSS gradients.
- No acid yellow, looping text distortion or tiny fabricated telemetry.

## Routes and content

### Home /

Header: James / Toru, Work, About, Experience, Contact and a compact Effects control. Main links should be ordinary usable navigation, with keyboard and touch states.

Hero: city art, large James Gatoru display name, Software Developer / AI Agentic Engineer, concise description, Explore my work and Let's talk. Desktop includes the concept's right-side three-project index. The index becomes a normal stacked section on small screens. Proposed initial featured labels: Agentic Workflows, IGC Portal, Lugawa. The AI label is a descriptive grouping from the CV, not a verified product name; repository-specific details can replace it once reviewed.

Then: selected case studies, short capabilities section using demonstrated skills, professional experience, concise about statement and final contact area. The cobalt contact band is retained as a strong visual close; avoid repeating identical calls to action at every screen.

### Work /work/

A complete archive with compact search by title/technology and optional category buttons. Proposed categories: All, AI & Automation, Web Platforms, Websites, Experiments. Category assignments are editorial and must be checked against sources. Show a clear results count and useful empty state with Reset filters. Controls wrap naturally; no horizontal-only filter carousel.

Professional projects and original repositories appear as regular archive records. Clearly identified forks and profile/supporting repositories appear in a supporting repository section on this route so the source collection is complete without suggesting every repository is a shipped client product. All public repositories remain reachable. Lugawa and Texplore each merge their CV entry with the matching repository. Do not merge AI repositories into TYTOS client work without evidence.

No build or runtime dependency on GitHub availability. Archive links work with JavaScript disabled; enhanced filtering may require JavaScript, with all content visible by default.

### Project /work/[slug]/

Directly shareable static pages. Include verified title and category, context, role, scope, technologies, source-backed contribution and any verified repository/demo link. Only include results when supported. Include Back to work, Next project and a contact action.

A project with sparse source material gets a concise honest overview. Do not expose internal research notes such as 'role unverified' to visitors; omit unsupported claims. Use an attractive explicitly illustrative visualization when real screenshots are unavailable. No empty case-study headings or fake screenshots.

### About, experience and contact

Use homepage sections and anchor links for the first version. Present concise source-backed experience and skills; no percentage bars. Contact links use gatorumbugua@gmail.com, GitHub and the CV's LinkedIn URL. No public telephone by default. A CV link should use a public-facing derivative of the supplied compact CV with the confirmed email, not the longer PDF containing referee contacts. Keep both originals unchanged. PDF preparation is an implementation asset task and must follow the PDF verification workflow.

## Project research and editorial readiness

See docs/research/project-sources.json. The live GitHub API snapshot on 2026-11-02 contains 17 public repositories. The CV supplies 13 project/group entries; two match repository names directly. The inventory preserves all records and source provenance. It is a source collection, not 28 finished project case studies.

Several repository descriptions are empty. Read README and relevant public source before writing case-study narratives. GitHub homepage values still need live-link checks. Academic exercises, tests, the profile repository and the fork retain appropriate labels. Do not manufacture architecture or outcomes from repository names. Generic CV project titles are explicitly marked in research. The Elixar/Ellixar spelling and Kalamu/IoT School responsibilities need editorial care; use neutral safe wording until confirmed.

## Responsive composition

Build from 320 CSS pixels upward with fluid sizing and content-led breakpoints, not a scaled desktop canvas.

- 320-479: single column; readable name wrapping; compact masthead and labeled Menu; a portrait-aware city crop; two large stacked or wrapped action links; featured index below the intro. Full-width project rows, visible category text and wrapping filters. Minimum 44x44 CSS-pixel interaction areas. Reserve space for menu and Effects control.
- 480-767: roomier single-column composition; actions may share a row when labels fit; project imagery retains intrinsic ratios.
- 768-1023: two-column content where the text remains comfortable; project index can move below the hero rather than compressing into a narrow strip.
- 1024 and above: reproduce the selected concept's asymmetric identity with large left name, city above/behind and right-side work index.
- Above 1600: constrain content width while letting atmospheric art extend; maintain readable line lengths.
- Landscape phones, 200% zoom and long titles must reflow. No horizontal page overflow, clipped headings, hidden contact links or fixed-height hero that traps content.
- Use native document scrolling, anchor offsets for any sticky header and safe-area insets where needed. Menu opens accessibly, closes with Escape, restores focus and does not trap users after a route change.
- Never make information depend on hover; keyboard focus and taps reach the same content.

## Motion and adaptive effects

Static HTML and artwork are the base; enhance after critical content is visible. Small screens are not a reliable proxy for performance, and low-core or memory signals alone must not determine device quality.

Enhanced mode requires no reduced-motion preference and a fine hover-capable pointer for pointer effects. Suggested maximum is three city art layers plus a single bounded rain layer, with a gentle 8-12px depth response and 150-250ms link/row transitions. Art glow and grain are baked into assets; avoid animated blur, large live shadows and large CSS filter effects.

Pointer work is requestAnimationFrame-coalesced, applied to transforms and run only while needed. Decorative effects stop when the hero leaves the viewport or the document becomes hidden. Rain is localized to the hero; cap its animation work, and use a simpler or static treatment on touch devices. Interface focus/press feedback remains available everywhere.

Effects control offers Auto and Off; Off stops all nonessential ambient and pointer animation and persists locally when storage is available. Auto always respects the operating system's reduced-motion choice. Reduced-motion users get a complete static composition with immediate content, focus feedback and no spatial parallax. Do not require a motion opt-in to read the portfolio.

Performance-aware fallback can simplify or disable ambient effects after sustained frame delays, if profiling shows it is needed. Regardless of runtime heuristics, the owner can choose Off. No gyroscope permissions or device tilt controls.

## Asset and performance targets

These are proposed budgets and acceptance targets, not measured results:
- Mobile above-fold transfer budget at or below roughly 750 KB compressed, including image, fonts and initial code; prioritize reducing the hero image before removing useful content.
- Mobile hero artwork target 200 KB or less in an efficient format where quality permits; serve a genuinely smaller crop with srcset/sizes or picture rather than downloading desktop art and hiding it.
- Initially shipped client JavaScript target 150 KB compressed or less, including framework runtime, with decorative effects deferred. Confirm from the actual build rather than promise the number.
- Supply image width/height, preload only genuinely critical resources, do not lazy-load the hero, and lazy-load below-fold imagery. Pre-optimize static-export images locally.
- Aim for LCP <=2.5s, CLS <=0.1 and INP <=200ms. Validate loading and stability in lab runs; real-user INP and 75th-percentile claims require field data after deployment.
- No animation dependency that pulls in a 3D engine for decoration; no autoplay video or runtime GitHub request.

## Verification and completion

Build verification: static export succeeds; every generated project route loads directly; no unavailable links render as working demo buttons; contact actions use the confirmed address; search/filter/reset and URL navigation behave correctly.

Visual checks in one batched pass at 320, 390, 768, 1024, 1440 and 1920 CSS pixels, including a landscape phone and 200% zoom spot-check. Inspect desktop and mobile against the chosen visual concept; confirm real text, stable artwork crops and full project access.

Interaction checks: keyboard navigation, focus visibility, touch actions, menu, empty filters, Effects Off, reduced motion and JavaScript-disabled core content. Check contrast and meaningful image alternatives.

Performance checks: mobile CPU/network throttling with repeatable settings, compressed asset totals and a browser trace with hero effects active and inactive. Confirm no continuous work while offscreen/hidden and remove effects that compete with reading, scrolling or input. Emulation is not proof of performance on every physical low-tier device; report tested environments and any limits.

## Builder discretion and review gate

Builder may choose exact breakpoints, licensed font match, effect density, content-schema implementation, image formats and small copy refinements consistent with verified facts. Framework recommendation, first-release contact design, project presentation and responsive/motion behavior are part of this proposal for owner review.

No product code, dependency installation, scaffolding or deployment has been authorized by approval of a static concept alone. After this written design is approved, prepare the implementation plan and then build.

## References

- Implementation reference requested by owner: https://github.com/James-Toru/raxos-website, reviewed at commit 9f68e20ee9b94f6df88b996b8e1a68da00a34de3. See docs/research/raxos-reference.md for adaptation notes.
- Selected image: concepts/cyberpunk-midnight-network-v2.png.
- Mobile composition proposal: concepts/cyberpunk-midnight-mobile-v1.png. This is a static illustration of hierarchy, not proof of runtime responsiveness, exact touch-target dimensions or performance; the written layout/accessibility requirements govern implementation.
- Source inventory: docs/research/project-sources.json.
- Next.js static export: https://nextjs.org/docs/app/guides/static-exports
- Motion and compositor-friendly animation: https://developer.chrome.com/docs/modern-web-guidance/guides/ui-behaviors/motion
- Core Web Vitals definitions and thresholds: https://web.dev/articles/vitals
- Responsive image delivery: https://web.dev/learn/design/responsive-images
- Pointer capabilities: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/pointer

