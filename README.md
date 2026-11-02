# James Gatoru — Midnight Network

A static-export portfolio built with Next.js, React and TypeScript. All content, artwork and fonts are local. The approved visual direction is recorded in `docs/superpowers/specs/2026-11-02-midnight-network-design.md`.

## Local development

Use Node 24.15 or later within major 24 and pnpm 11.25.0:

```sh
pnpm install
pnpm dev
pnpm test
pnpm typecheck
pnpm build
```

`pnpm build` writes the static site to `out/`. Publishing is a separate step. No backend, account registration or runtime GitHub request is required.

## Content and assets

- `src/content/profile.ts`: contact details and experience.
- `src/content/projects.ts`: public project records.
- `public/art/manifest.json`: original source dimensions, derivative dimensions, crop coordinates, byte sizes and hashes.
- `public/fonts/`: two local OFL-licensed families, Barlow and Barlow Condensed; licenses and source URLs included.
- `public/james-gatoru-cv.pdf`: one-page public derivative, with confirmed email and no referee contacts or telephone. Original supplied CVs remain unchanged.

City, workflow and portal artwork was generated specifically for this portfolio. Exact prompts and original source images are retained in `docs/art-source/`. Project artwork is illustrative, not a product screenshot. The approved concept images are design references and are never shipped as page backgrounds.

`scripts/prepare-art.py` regenerates optimized AVIF and WebP derivatives with Pillow. `scripts/prepare-public-cv.py` builds the public CV using ReportLab and the licensed TTF equivalents in `scripts/assets/fonts/`. Changes to the CV require rendering and inspecting the actual PDF, not just checking extracted text.

## Navigation and access

The shell uses semantic HTML, a skip link, visible focus states and native scrolling. The mobile menu is a native disclosure that works without JavaScript; its enhancement closes on navigation and restores focus on Escape. Local artwork is decorative, while the name, role and contact routes remain real HTML. The later route and effects tasks extend this foundation.
