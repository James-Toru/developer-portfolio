# Midnight Network Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build James Gatoru's approved blue cyberpunk portfolio with a complete source-backed project archive, shareable project pages, responsive layouts and lightweight reactive city effects.

**Architecture:** Next.js App Router static export with server-rendered content and narrow client components for navigation, search and effects. Locally optimized original artwork and local project records make the site independent of runtime external APIs. RAXOS supplies implementation references for frame geometry, artwork organization and performance-aware input handling; Midnight Network's selected mockups remain visual authority.

**Tech Stack:** Next.js, React, TypeScript, native CSS, Vitest with jsdom for content/effects logic; existing bundled Python/Pillow for asset optimization and the PDF skill/runtime for a public CV derivative. Pin compatible stable package versions and commit the lockfile; verify against current official releases during setup. No Framer Motion, Three.js or server email dependency.

**Spec:** docs/superpowers/specs/2026-11-02-midnight-network-design.md
**Implementation reference:** docs/research/raxos-reference.md; RAXOS commit 9f68e20ee9b94f6df88b996b8e1a68da00a34de3.

## Global Constraints

- Contact email: gatorumbugua@gmail.com.
- No acid yellow, looping text distortion or tiny fabricated telemetry.
- Minimum 44x44 CSS-pixel interaction areas.
- Initially shipped client JavaScript target 150 KB compressed or less, including framework runtime, with decorative effects deferred.
- Mobile above-fold transfer budget at or below roughly 750 KB compressed, including image, fonts and initial code.
- Mobile hero artwork target 200 KB or less in an efficient format where quality permits.
- Aim for LCP <=2.5s, CLS <=0.1 and INP <=200ms; these are targets, not pre-launch field measurements.
- Static-export routes, real HTML text, native scrolling, local content and at most two local font families.
- Preserve all CV project records and all 17 public repository records. Merge only matching Lugawa/Texplore entries. Identify forks and supporting repositories accurately.
- No invented responsibilities, screenshots, outcomes, testimonials, availability or unverified live-demo actions.
- Effects Auto respects reduced motion; Off stops nonessential ambient and pointer animation.
- Work locally in the current workspace; deployment is outside this approved release until separately requested.
- Keep original CVs and concept images unchanged.

## Review Focus

1. Narrow screens, long project names, landscape phones and zoom must reflow without page overflow or inaccessible actions.
2. Reduced-motion changes, Effects Off, hidden tabs and offscreen heroes must stop decorative work.
3. JavaScript-disabled visits and direct project URLs must retain useful content and navigation.
4. Empty search, mixed-case technology queries, forks and duplicate CV/GitHub names must preserve accurate archive results.
5. Missing images, unavailable demos, denied localStorage and failed image loads must leave readable useful pages.

## File structure

- Root package/config files: package.json, lockfile, next.config.ts, tsconfig.json, next-env.d.ts, .gitignore, vitest.config.ts.
- src/content/projects.ts and profile.ts: publishable source-backed project/profile records, not internal research notes.
- src/lib/projects.ts and projects.test.ts: search, category and identity helpers.
- src/lib/effects-policy.ts and effects-policy.test.ts: input/preference/visibility policy.
- src/lib/hero-effects.ts and hero-effects.test.ts: scoped pointer subscriptions and cancellable animation lifecycle.
- src/app/layout.tsx, globals.css, page.tsx, work/page.tsx, work/[slug]/page.tsx and not-found.tsx: static routes, metadata and global tokens.
- src/components/site-header.tsx, effects-control.tsx, city-hero.tsx, project-index.tsx, project-archive.tsx, project-overview.tsx, experience.tsx and contact.tsx: focused sections and controls.
- src/styles/header.css, hero.css, projects.css and sections.css: scoped layout/effect styling, imported through globals.css.
- public/art/: original desktop/mobile skyline assets, limited art layers, illustrative project art and prompt/source provenance.
- public/fonts/: licensed local display/body font subsets and licenses.
- public/james-gatoru-cv.pdf: public-facing CV derivative with confirmed email and no referee contact details.
- scripts/check-static-output.mjs and measure-assets.mjs: route/link/content checks and compressed asset reporting.
- README.md: local commands, content editing, effects behavior and verification limits.

## Task 1: Source-backed project archive and static foundation

**Files:** root package/config files; src/content/projects.ts, profile.ts; src/lib/projects.ts, projects.test.ts; scripts/check-static-output.mjs.

**Interfaces:**
- Project record fields: slug, title, category, kind, summary, technologies, context?, contribution?, organization?, repository?, demo?, image?, featured.
- kind is professional | personal | experiment | fork | supporting.
- getProjects(): readonly Project[]; getProject(slug: string): Project | undefined.
- filterProjects(projects: readonly Project[], query: string, category: string): Project[].
- getNextProject(slug: string): Project | undefined.
- Profile record includes display name, role, email, social links and verified experience.

- [ ] Read the worktree skill, inspect Git state and preserve existing concepts/docs. This repository is initially unborn main; establish a safe codex/midnight-network branch in the approved workspace when Git permissions allow rather than assuming an existing worktree base.
- [ ] Inspect public READMEs/relevant source and verify provided homepage URLs for archive copy; retain concise overviews where evidence is sparse. Mark RAXOS as owner-built per this conversation. Do not merge similarly named AI repos with TYTOS client work.
- [ ] Set up a static-export Next/TypeScript package and minimal Vitest configuration; install only necessary dependencies through the bundled runtime.
- [ ] Write failing tests asserting unique slugs, coverage of all 13 CV records and 17 repo references, correct two merges, explicit fork/supporting labels, absence of fabricated demos, and case-insensitive title/technology filtering.
- [ ] Run the content test file and confirm genuine assertion/import failures before implementing helpers and publishable records.
- [ ] Implement the record schema, helpers and complete source-backed content. Unknown fields stay absent; full source provenance remains outside public content.
- [ ] Re-run tests and verify the expected merged archive is complete. Commit this independently working foundation when Git writes are permitted.

## Task 2: Original artwork, public CV and semantic site shell

**Files:** public/art/*, public/fonts/*, public/james-gatoru-cv.pdf; src/app/layout.tsx, globals.css; src/components/site-header.tsx; src/styles/header.css; README.md.

**Interfaces:** SiteHeader() provides normal navigation and a mobile menu. The art manifest identifies desktop/mobile source sizes and actual intrinsic dimensions.

- [ ] Read the Impeccable craft floor immediately before UI edits. Use the approved desktop/mobile concepts as the fixed direction; do not restart concept selection. Follow available comp-led helpers; if the unavailable launcher remains unavailable, retain the approved comp as the explicit comparison authority and document the manual measurement limitation.
- [ ] Generate original text-free skyline artwork and only the isolated layers needed for gentle depth. Use the selected mockup as a style/composition reference; do not ship a crop or full mockup. Save exact prompts/source provenance.
- [ ] Optimize distinct portrait and landscape variants locally, check actual file sizes and image integrity, and preserve the skyline's focal composition. Produce supporting illustrative project imagery where no real images exist, labeled accordingly.
- [ ] Obtain two suitable licensed local font subsets, record licenses, and use fluid display sizing with an accessible body face.
- [ ] Follow the PDF skill to create/render/inspect a concise public CV derivative with confirmed email, source-backed dates and no referee details. Keep originals unchanged. Resolve the conflicting education certificate end year using the compact CV's 2019 value; do not copy the 2029 typo.
- [ ] Build semantic layout, skip link, metadata, visible desktop navigation and accessible labeled mobile menu. Menu supports keyboard, Escape, focus restoration and closure on navigation.
- [ ] Inspect the shell at 320 and 1440 CSS px before extending sections. Confirm 44px actions, uncut focus outlines and useful rendering if art fails. Commit the shell and assets.

## Task 3: Homepage, complete archive and project detail routes

**Files:** src/app/page.tsx, work/page.tsx, work/[slug]/page.tsx, not-found.tsx; src/components/city-hero.tsx, project-index.tsx, project-archive.tsx, project-overview.tsx, experience.tsx, contact.tsx; src/styles/hero.css, projects.css, sections.css.

**Interfaces:** CityHero({featured: readonly Project[]}); ProjectIndex({projects: readonly Project[]}); ProjectArchive({projects: readonly Project[]}); ProjectOverview({project: Project, next?: Project}). Static route generation uses getProjects()/getProject() from Task 1.

- [ ] Add static-output checks that fail until /, /work/ and all project URLs exist with meaningful heading/content, confirmed mailto and normal back links.
- [ ] Build the desktop hero to match Midnight Network: upper skyline, large left name, legible role/description, cobalt action and right-side work index. On phones use an intrinsic stacked layout with a deliberate portrait crop.
- [ ] Build selected work, capabilities, experience, about and contact with distinct composition and verified copy. Use the public CV derivative. Every section has a meaningful heading and anchor target.
- [ ] Implement the complete /work/ archive with initial server-rendered content, client search/category enhancement, accurate result counts and Reset filters. Supporting repo/fork section remains visible and labeled.
- [ ] Generate a concise useful page for each project slug, with only supported sections/links and an illustrative asset label where applicable. Cover invalid slugs with a useful 404. Do not expose editorial research flags.
- [ ] Run content tests, static export and static-output checks; confirm all project URLs work directly and core reading/navigation survives JavaScript-disabled loading.
- [ ] Commit the complete responsive content experience.

## Task 4: Lightweight reactive city and effects controls

**Files:** src/lib/effects-policy.ts, effects-policy.test.ts, hero-effects.ts, hero-effects.test.ts; src/components/effects-control.tsx; city-hero.tsx; hero.css.

**Interfaces:**
- resolveEffectsPolicy({preference, reducedMotion, finePointer, hover, visible, documentVisible}) returns {ambient: boolean, pointer: boolean}.
- preference is auto | off. reducedMotion or off disables both; pointer also requires finePointer and hover; invisible/hidden disables both.
- EffectsPolicy is {ambient: boolean, pointer: boolean}.
- mountHeroEffects(root: HTMLElement, layers: readonly HTMLElement[], initialPolicy: EffectsPolicy): HeroEffectsController, where the controller exposes updatePolicy(policy: EffectsPolicy): void and destroy(): void. It owns the scoped pointer listeners and pending frames; destroy removes/cancels them. The CityHero component owns media-query, document-visibility and IntersectionObserver subscriptions and forwards policy changes to the controller.
- EffectsControl reads/writes a namespaced local preference safely; blocked storage falls back to component state without failing.

- [ ] Write failing tests for effects-off/reduced-motion/coarse-pointer/hidden/offscreen combinations and live preference changes. In jsdom, mock requestAnimationFrame/cancelAnimationFrame and dispatch pointer events to test controller cleanup, asserting no pending frames after deactivation/destroy and no repeating idle pointer loop. Check observer/media-query subscription cleanup through the browser verification in Task 5.
- [ ] Run those tests and confirm failures before writing the runtime.
- [ ] Implement scoped event-driven pointer transforms, maximum gentle 8-12px movement, one bounded rain treatment and 150-250ms interface transitions. Bake glow/grain into art and keep essential text static.
- [ ] Subscribe to reduced-motion changes, visibilitychange and IntersectionObserver; cancel rather than continuing to schedule hidden work. Touch gets a simpler/static hero, fully functional focus/press feedback and no tilt permissions.
- [ ] Implement Auto/Off control with accessible name/state and safe persistence. Do not animate the initial content from hidden to visible or block reading behind a preloader.
- [ ] Run policy/lifecycle tests, then browser-check Off, live reduced-motion changes, tab visibility, offscreen scrolling and storage-denied fallback. Commit motion behavior.

## Task 5: Responsive, accessibility and performance verification

**Files:** scripts/check-static-output.mjs, measure-assets.mjs; README.md; observed fixes to previous task files; verification screenshots/results under docs/verification/.

**Interfaces:** measure-assets reports compressed route code and actual image/font sizes without claiming real-user metrics. Static checks return nonzero for missing project pages, bad required content, unresolved internal links or unsupported demo buttons.

- [ ] Run tests, type checking, static export and output checks. Record exact commands/results, generated route count and asset totals.
- [ ] Follow the Sites local-preview reference, start one local preview and show the recognizable implementation through supported browser tools. This is local-only work under the approved brief; do not register/publish a hosted Site.
- [ ] Batch visual checks at 320, 390, 768, 1024, 1440 and 1920 CSS px, plus landscape and 200% zoom. Compare desktop/mobile with selected concepts; test long names, search empty/reset, keyboard menu, link focus and image-failure layout.
- [ ] Test JavaScript-disabled direct project loads and storage-denied effects behavior. Verify contrast and 44px interaction areas in the actual DOM.
- [ ] Measure loading/stability under recorded mobile CPU/network throttling and inspect active/inactive effect traces. Check mobile hero <=200KB where quality allows, above-fold <=750KB and initial compressed JS <=150KB. If a target is missed, fix the actual bottleneck or report the measured limitation explicitly; do not announce a field INP pass from lab data.
- [ ] Fix observed defects in one batch, then run one confirmation visual pass. Broaden tests only for new failures or changes.
- [ ] Invoke the required whole-implementation review and design finish/documentation workflows with fresh review context, the approved spec, RAXOS reference, actual source and verified screenshots. Resolve material findings and verify any corrections.
- [ ] Document final commands, content-editing instructions, effects behavior, source inventory coverage and outstanding factual/physical-device verification limits. Leave deployment outside scope. Commit the verified build when Git writes are permitted and return a running local preview plus file links.

## Execution choice

The owner approved this plan on 2026-11-02 and selected subagents to implement and review each task. Implementation proceeds in the selected local workspace on `codex/midnight-network`. Publishing and remote integration remain separate decisions.

