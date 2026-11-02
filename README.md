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
- `src/content/project-art.ts`: optional, explicitly illustrative art assignments.
- `public/art/manifest.json`: original source dimensions, derivative dimensions, crop coordinates, byte sizes and hashes.
- `public/fonts/`: two local OFL-licensed families, Barlow and Barlow Condensed; licenses and source URLs included.
- `public/james-gatoru-cv.pdf`: one-page public derivative, with confirmed email and no referee contacts or telephone. Original supplied CVs remain unchanged.

City, workflow and portal artwork was generated specifically for this portfolio. Exact prompts and original source images are retained in `docs/art-source/`. Project artwork is illustrative, not a product screenshot. The approved concept images are design references and are never shipped as page backgrounds.

`scripts/prepare-art.py` regenerates optimized AVIF and WebP derivatives with Pillow. `scripts/prepare-public-cv.py` builds the public CV using ReportLab and the licensed TTF equivalents in `scripts/assets/fonts/`. Changes to the CV require rendering and inspecting the actual PDF, not just checking extracted text.

## Navigation and access

The shell uses semantic HTML, a skip link, visible focus states and native scrolling. The mobile menu is a native disclosure that works without JavaScript; its enhancement closes on navigation and restores focus on Escape. Local artwork is decorative, while the name, role and contact routes remain real HTML. The diagonal name cuts are static CSS masks on selectable HTML text.

`/work/` renders all 28 records before hydration. Search matches title or technology; category and search combine, and Reset filters restores the archive. Filters stay disabled without JavaScript. Every project has a pre-rendered `/work/[slug]/` page with back/next navigation. Native email, repository, verified website and CV links remain usable without the app scripts.

Effects Auto defers the small enhancement module until the hero is visible and a fine, hover-capable pointer is present. It respects reduced motion and stops while the hero is offscreen or the document is hidden. Effects Off stops ambient rain and pointer response; the namespaced local preference persists where storage is available. Denied storage leaves the control usable in memory. Touch users retain the complete static illustration. None of the text depends on animation.

## Editing and verification

Add a project as one source-backed record in `src/content/projects.ts`, using a unique URL-safe slug. Keep repository/demo fields only for verified destinations; omit unsupported roles or outcomes. Mark forks/supporting repositories accurately. Update provenance in `docs/research/project-sources.json` and the content tests when the source inventory changes. The present inventory preserves all 13 CV project/group records and all 17 public repositories, merging only matching Lugawa/Texplore records (28 final entries). Do not merge a personal AI repository into client work without evidence. Rebuild to generate the new direct route.

`pnpm test` runs the content, static HTML, effects lifecycle and verification-utility fixtures. `pnpm check:static` exits nonzero for missing project pages, wrong required project content, missing contact/source actions, unresolved internal links/fragments/assets, invalid image dimensions/alternatives or unsupported demo actions. It does not assert remote uptime. `pnpm measure:assets` prints route-level raw/gzip/Brotli sizes, actual font/art sizes, and explicit budget estimates; it is not a field performance measurement.

Modern initial JavaScript includes the framework and excludes `nomodule` polyfills skipped by modern browsers. The report includes those polyfills and the all-script union separately. Inline bootstrap/RSC payload is included in compressed HTML. The mobile estimate conservatively includes all homepage AVIF illustrations (even lazy below-fold ones), all local WOFF2 fonts, and compressed HTML/CSS/initial JS. Real transport depends on the host's compression configuration.

Recorded evidence and current verification limits are in `docs/verification/README.md`; reproducible size data is in `docs/verification/asset-sizes.json`. CPU/network-throttled Lighthouse metrics, active/inactive traces, actual 200% browser zoom and physical-device performance remain unverified. No field INP or percentile claim is made. Deployment remains outside the approved local release.
