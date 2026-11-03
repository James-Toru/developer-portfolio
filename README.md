# James Gatoru — Midnight Network

A static-export portfolio built with Next.js, React and TypeScript. All content, artwork and fonts are local. The approved visual direction is recorded in `docs/superpowers/specs/2026-11-02-midnight-network-design.md`.

## Local development

Use Node 24.15 or later within major 24 and pnpm 11.25.0:

```sh
pnpm install
pnpm dev
pnpm typecheck
pnpm build
pnpm test
pnpm check:static
pnpm measure:assets
pnpm preview
```

`pnpm build` writes the static site to `out/`. Build before running tests: the HTML tests intentionally read the actual export. `pnpm preview` serves only `out/` at http://127.0.0.1:4173/, with gzip for text and the exported custom 404 for unknown paths. Pass a different port with `pnpm preview 4175`. For image failure-layout QA, use `pnpm preview 4173 --block-images`; the port must precede the optional flag, which adds an image-blocking CSP. The preview is a development utility, not a shipping backend. Publishing is a separate step. No backend, account registration or runtime GitHub request is required.

## Content and assets

- `src/content/profile.ts`: contact details and experience.
- `src/content/projects.ts`: public project records.
- `src/content/project-art.ts`: labeled website previews and illustrative cover assignments.
- `public/projects/manifest.json`: public preview sources, capture date, dimensions, optimized sizes and hashes.
- `public/art/manifest.json`: original source dimensions, derivative dimensions, crop coordinates, byte sizes and hashes.
- `public/fonts/`: two local OFL-licensed families, Exo 2 for body text and Barlow Condensed for display headings; licenses and source URLs included.
- `public/james-gatoru-cv.pdf`: one-page public derivative, with confirmed email and no referee contacts or telephone. Original supplied CVs remain unchanged.

City, workflow and portal artwork was generated specifically for this portfolio. Exact prompts and original source images are retained in `docs/art-source/`. Illustrative covers remain explicitly labeled. Nine real public website/sign-in captures are stored in `docs/project-previews/2026-11-03/`; `scripts/prepare-project-previews.py` creates local AVIF/WebP previews without changing their content. No authenticated product data is included. DOLMIS has an illustrative cover because its website presented a certificate-date error during capture. The approved concept images are design references and are never shipped as page backgrounds.

`scripts/prepare-art.py` regenerates optimized AVIF and WebP derivatives with Pillow. `scripts/prepare-public-cv.py` builds the public CV using ReportLab and the licensed TTF equivalents in `scripts/assets/fonts/`. Changes to the CV require rendering and inspecting the actual PDF, not just checking extracted text.

## Navigation and access

The shell uses semantic HTML, a skip link, visible focus states and native scrolling. The mobile menu is a native disclosure that works without JavaScript; its enhancement closes on navigation and restores focus on Escape. Local artwork is decorative, while the name, role and contact routes remain real HTML. The diagonal name cuts are static CSS masks on selectable HTML text.

`/work/` renders all 13 curated records before hydration. Search matches title or technology; category and search combine, and Reset filters restores the archive. Filters stay disabled without JavaScript. Every project has a pre-rendered `/work/[slug]/` page with back/next navigation. Native email, repository, website and CV links remain usable without the app scripts. LawPro360, DOLMIS, CargoForward360 and Nashami Limited lead the homepage. Existing case-management and consignment URL slugs are retained for shared links.

The city background stays stationary under all pointer input. Effects Auto defers optional rain until the hero is visible and a fine, hover-capable pointer is present. It respects reduced motion and stops while the hero is offscreen or the document is hidden. Effects Off stops ambient rain; the namespaced local preference persists where storage is available. Denied storage leaves the control usable in memory. Touch users retain the complete static illustration. None of the text depends on animation.

## Editing and verification

Add a project as one source-backed record in `src/content/projects.ts`, using a unique URL-safe slug. Keep repository/demo fields only for supplied or checked destinations; omit unsupported roles or outcomes. The owner's 2026-11-03 curation replaces the original complete-repository selection: the requested repositories, forks and supporting section are excluded. The original source research remains historical evidence in `docs/research/project-sources.json`; the current choices are recorded in `docs/research/portfolio-curation-2026-11-03.json`. Do not merge a personal AI repository into client work without evidence. Rebuild to generate the new direct route.

`pnpm test` runs the content, static HTML, effects lifecycle and verification-utility fixtures. `pnpm check:static` exits nonzero for missing project pages, wrong required project content, missing contact/source actions, unresolved internal links/fragments/assets, invalid image dimensions/alternatives or unsupported demo actions. It does not assert remote uptime. `pnpm measure:assets` prints route-level raw/gzip/Brotli sizes, actual font/art sizes, and explicit budget estimates; it is not a field performance measurement.

Modern initial JavaScript includes the framework and excludes `nomodule` polyfills skipped by modern browsers. The report includes those polyfills and the all-script union separately. Inline bootstrap/RSC payload is included in compressed HTML. The mobile estimate conservatively includes all homepage AVIF illustrations (even lazy below-fold ones), all local WOFF2 fonts, and compressed HTML/CSS/initial JS. Real transport depends on the host's compression configuration.

Current typography evidence is in `docs/verification/2026-11-03-exo-2.md`, with reproducible sizes in `docs/verification/asset-sizes-2026-11-03-exo-2.json`. Content-update checks remain in `docs/verification/2026-11-03-project-follow-up.md` and `docs/verification/2026-11-03-project-update.md`; the initial release's historical checks remain in `docs/verification/README.md`. CPU/network-throttled Lighthouse metrics, active/inactive traces, actual 200% browser zoom and physical-device performance remain unverified. No field INP or percentile claim is made. Deployment remains outside the approved local release.
