# Curated projects and real previews — 2026-11-03

The owner requested LawPro360, DOLMIS, CargoForward360 and Nashami Limited; removal of the named repositories and the supporting section; and removal of the hero background's pointer movement. This update keeps the existing Midnight Network visual system.

## Content and media

- 18 curated entries, with the four major projects featured. DOLMIS updates `ecms`; CargoForward360 updates `consignment-management`. Existing slugs remain valid.
- The nine named repositories plus the two supporting records and their fork record are removed from the public archive, generated project routes and supporting navigation. The original research inventory remains historical, with current selection in `docs/research/portfolio-curation-2026-11-03.json`.
- Seven real public captures: LawPro360, CargoForward360, Nashami Limited, RAXOS, Njoroge Kiriro Advocates, Agent Foundry and AnyPost. Agent Foundry is explicitly a public sign-in preview. No authenticated pages were entered or captured.
- DOLMIS returned `ERR_CERT_DATE_INVALID` in the browser. No security warning was bypassed. Its existing document illustration is labeled “Illustrative cover”; no dashboard screenshot was invented.
- Capture originals are JPEGs in `docs/project-previews/2026-11-03/`. Local AVIF/WebP derivatives, dimensions, source URLs, date and hashes are in `public/projects/manifest.json`. AVIF files range from 4,482 to 21,883 bytes; captures were resized and encoded without altering their content.
- Previews appear in selected work, the archive and project details, with captions distinguishing screenshots from illustrations.

## Motion

The city image stays stationary. Auto can enable bounded rain; Off, reduced motion and visibility controls remain. Browser check with Auto and actual pointer interaction: ambient=true, pointer=false, art style=null and computed art transform=none. The original Off preference was restored after testing.

## Automated evidence

Bundled Node24.22.1 was used. Initial focused RED: 6 failed/10 passed, including the old 28-entry collection and moving background. Focused GREEN: 16/16. Final build, with Windows sandbox write denial resolved by rerunning the identical build with permitted host execution, exited0 and generated22pages, including18projectpages. The build's TypeScript check succeeded.

Final full Vitest:53/53 across5files; verification fixtures:4/4. Static checker:23HTMLfiles,18projectpages,157internalfiles,errors[]. Git diff whitespace check passed (ordinary Git CRLF notices only).

Asset accounting in [asset-sizes-2026-11-03.json](asset-sizes-2026-11-03.json): modern initial JS maximum138,004bytes gzip; mobile hero51,232bytes; conservative mobile homepage estimate331,726bytes, including all homepage pictures, fonts and compressed HTML/CSS/initialJS. All remain within the existing budgets. These are file-size estimates, not browser waterfall or field measurements.

## Browser evidence

Actual DOM checks: homepage at320(client/scroll305),390(375) and1440(1425) had no horizontal overflow. Archive at320(305) and390(375) had no overflow;18articles and no supporting section. The first four archive previews loaded their intended AVIF sources. Searching “nashami” returned1of18 with the expected title, design scope and real preview. Nashami's direct detail at390 also had equal375px client/scroll widths and its real AVIF preview.

Screenshots in `screenshots/2026-11-03/`: full desktop homepage,390phone homepage,320homepage, phone archive, phone Nashami detail and desktop selected work. The desktop full-page capture was taken from scrollY0 after all four featured images were actually loaded. Source capture tabs were closed; the local preview remains available.

Existing limitations remain: no successful throttled Lighthouse audit/active-inactive trace, actual200%browserzoom or physical-device test. No field INP or full accessibility certification is claimed. Original CV files and the public CV derivative were not changed.

## Independent review

A fresh combined code/design reviewer inspected the implementation and all six required captures. Two initially misframed captures were replaced with a settled selected-work view and a mobile archive from document top, followed by a full review of the corrected evidence. Disposition: ship; Critical, Important and Minor code findings: none. This verdict covers the local refinement, not remote uptime or unmeasured performance targets. A separate fresh documenter verified PRODUCT.md, DESIGN.md and the sidecar against the finished code and found no material drift or further changes needed.
