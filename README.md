# James Gatoru — Midnight Network

A portfolio built with Next.js, React and TypeScript, with a server-only Resend contact endpoint. Content, artwork and fonts are local; sending an enquiry uses the configured email service. The approved visual direction is recorded in `docs/superpowers/specs/2026-11-02-midnight-network-design.md`.

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

`pnpm build` creates the Next.js server build in `.next/`, then generates a fresh, ignored `out/` snapshot from its pre-rendered HTML and current assets for verification. Build before running the HTML tests, static checker or asset measurements. This snapshot cannot run the contact endpoint and is not a deployment artifact.

`pnpm preview` runs the actual Next.js server at http://127.0.0.1:4173/. For another port, use `pnpm exec next start --hostname 127.0.0.1 --port 4175`. The old static preview's positional port and `--block-images` flag do not apply. Production requires a host that supports the Next.js Node.js server or its server functions; static-file-only hosting cannot run this application. Hosting, account creation and publishing remain separate decisions.

## Contact setup

The form is shared by the homepage and work archive. Name, email and message are required, with limits of 100, 254 and 5,000 characters. Native browser checks complement authoritative server validation. While sending, fields are frozen and repeated submits are ignored. A confirmed provider acceptance clears the draft and announces “Message sent”; this confirms acceptance for delivery, not inbox arrival. Failure, unavailable configuration and the 15-second client timeout retain the draft for an explicit retry. No automatic retries occur. Direct email and profile links remain available; without JavaScript, use the email link.

For local review without sending real mail, leave `RESEND_API_KEY` and `CONTACT_FROM_EMAIL` blank. A valid submission returns an honest unavailable response. Automated tests mock the provider; a local build or form review does not prove live delivery.

When live delivery is needed, copy `.env.example` to the ignored `.env.local` and configure these values locally or through the host's secret settings:

- `RESEND_API_KEY`: a server API key from Resend.
- `CONTACT_FROM_EMAIL`: one plain email address on a domain verified in Resend, such as `contact@your-domain.example`; do not include a display name or angle brackets.
- `CONTACT_ORIGIN`: the exact public origin, such as `https://your-domain.example`, with no path, query or fragment. This is required for production, including local production previews (`pnpm preview`/`next start`): use `http://127.0.0.1:4173` for that preview if enabling live configuration. Only `pnpm dev` and tests can fall back to the request origin when it is absent.

Keep real values in ignored local files or host secrets; never commit them, prefix them with `NEXT_PUBLIC_`, paste them into chat, or place them in client code. Restart the server after changing runtime configuration. The recipient is fixed to `gatorumbugua@gmail.com`; the visitor's validated email is Reply-To. Visitors cannot choose a sender or recipient. No attachments, database, automatic replies or message logging are added. Live inbox delivery remains unverified until the owner configures Resend and explicitly performs or requests a real send.

The endpoint checks origin, JSON content, a hidden honeypot and a streamed 64 KiB body bound. It limits each process to 3 attempts per email and 60 total attempts per 10 minutes, with at most 60 expiring email records; failed provider attempts count. Its provider deadline is 10 seconds. These memory limits reset on restart and are separate across instances. Before public hosting, configure host-level shared or edge rate limits and request-size limits; this implementation is not a distributed anti-spam quota.

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

`pnpm test` runs the content, current build's HTML, effects lifecycle, contact endpoint/form and verification-utility fixtures. Contact tests use mocked delivery and send no real email. `pnpm check:static` exits nonzero for missing project pages, wrong required project content, missing contact/source actions, unresolved internal links/fragments/assets, invalid image dimensions/alternatives or unsupported demo actions. It does not assert remote uptime. `pnpm measure:assets` prints route-level raw/gzip/Brotli sizes, actual font/art sizes, and explicit budget estimates; it is not a field performance measurement.

Modern initial JavaScript includes the framework and excludes `nomodule` polyfills skipped by modern browsers. The report includes those polyfills and the all-script union separately. Inline bootstrap/RSC payload is included in compressed HTML. The mobile estimate conservatively includes all homepage AVIF illustrations (even lazy below-fold ones), all local WOFF2 fonts, and compressed HTML/CSS/initial JS. Real transport depends on the host's compression configuration.

Current typography evidence is in `docs/verification/2026-11-03-exo-2.md`, with reproducible sizes in `docs/verification/asset-sizes-2026-11-03-exo-2.json`. Content-update checks remain in `docs/verification/2026-11-03-project-follow-up.md` and `docs/verification/2026-11-03-project-update.md`; the initial release's historical checks remain in `docs/verification/README.md`. CPU/network-throttled Lighthouse metrics, active/inactive traces, actual 200% browser zoom and physical-device performance remain unverified. No field INP or percentile claim is made. Deployment remains outside the approved local release.
