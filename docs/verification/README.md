# Local verification — 2026-11-02

This records actual local evidence and its limits. Parent-owned browser evidence was collected with supported CUA APIs. No hosting or deployment occurred.

## Build and automated checks

Runtime used: bundled Node 24.22.1; Next 16.4.3, React 19.3.1, TypeScript 5.9.3 and Vitest 5.0.5. Native `node` on this machine resolves to 26.3.0, outside package engines; use the bundled Node or a supported Node 24 installation.

The final corrected export has 33 HTML files (including framework 404 aliases), all 28 project pages and 192 checked internal files. `node scripts/check-static-output.mjs` returned `errors: []`. Four new script fixtures pass and deliberately demonstrated RED first. The fixtures exercise missing/incorrect content, broken fragments/CSS assets, unsupported website actions, deduplicated modern/nomodule script sizes, mobile image/font accounting, exported404 behavior, rejected traversal, gzip negotiation and HEAD/method handling.

Final parent verification after the CSS corrections succeeded with bundled Node: `node node_modules/next/dist/bin/next build` exited 0 and generated 32/32 pages; `node node_modules/typescript/bin/tsc --noEmit` exited 0; `node node_modules/vitest/vitest.mjs run` passed all 62 cases across 5 files (5.50s); `node --test scripts/verification.test.mjs` passed all 4 fixtures (2.28s). Static checking and asset measurement exited 0. `git diff --check` exited 0, with only Git's ordinary working-copy CRLF notices. Earlier worker export failures and consequent missing-page test failures were superseded by this complete successful build and test run.

Run, in order:

```sh
pnpm typecheck
pnpm build
pnpm test
pnpm check:static
pnpm measure:assets
git diff --check
```

`pnpm test` runs both the 62 existing Vitest cases and 4 verification-utility fixtures. Utility tests run independently with `node --test scripts/verification.test.mjs`.

## Asset measurements

See [asset-sizes.json](asset-sizes.json). These values were regenerated from the complete final corrected export. Decimal KB is used.

| Measure | Recorded bytes | Budget bytes |
| --- | ---: | ---: |
| Maximum modern route initial JavaScript, gzip level 9 | 137,595 | 150,000 |
| Additional nomodule polyfill, gzip | 39,520 | separately reported |
| Homepage union of all external script tags, gzip | 177,115 | conservative union |
| Mobile hero AVIF, raw | 51,232 | 200,000 |
| Conservative mobile homepage transfer estimate | 341,618 | 750,000 |
| All local WOFF2 fonts, raw | 68,748 | included above |

The modern route estimate includes the framework runtime. A `nomodule` script is not requested by module-capable browsers; its bytes remain transparently reported. The homepage estimate includes gzip HTML (and inline RSC/bootstrap), initial modern JS, CSS, raw fonts and every mobile homepage AVIF picture, including lazy below-fold illustrations. It is conservative asset accounting, not an observed viewport waterfall. Brotli quality6 is reported separately. No hero duplication is counted for alternate WebP/desktop sources.

## Responsive and interaction evidence

[responsive-matrix.json](responsive-matrix.json) contains parent-recorded DOM values and screenshot links at 320,390,768,1024,1440 and1920 CSS-pixel widths. `scrollWidth === clientWidth` at each. No positive-size visible `a`, `button` or `summary` target was below44px in either dimension. Scrollbars account for the15px difference between viewport and content widths. The mobile AVIF was selected at320/390; the desktop AVIF at larger widths.

Additional parent evidence:

- Landscape844x390: no horizontal overflow (829px client/scroll widths). After the review fix, the name spans y101–219.81, role y231.81–257.81 and primary action y302.48–356.48, all inside the first 390px. Both actions are visible in the confirmation screenshot.
- Archive320: all28 entries rendered, no overflow (305px). Search by title/technology, category combination, empty/reset and direct project navigation were exercised in the actual browser.
- Long-title ECMS detail320: no overflow (305px). [Screenshot](screenshots/final-detail-320.jpg).
- Image-blocked390: local CSP `img-src 'none'`; hero image complete=true/naturalWidth=0, with real heading/description/actions present and no overflow (375px). [Screenshot](screenshots/final-images-blocked-390.jpg).
- App scripts blocked: separate local CSP `script-src 'none'`;28 archive entries visible, filters disabled, native IGC website action works. [Direct-page screenshot](screenshots/no-script-project.jpg). This approximates app JavaScript unavailable; the browser-global JavaScript flag was not disabled and noscript-notice visibility was not verified.
- Actual Effects Off/persistence, pointer response and hero-offscreen suspension were verified by the parent during Task4. Media preference changes, hidden document, denied storage, cleanup and frame coalescing are unit/jsdom evidence, not live device emulation.

Actual200% browser zoom was unavailable through the current browser APIs;320px reflow was tested, which does not substitute for browser zoom. No physical phone/tablet was tested. [responsive-confirmation.json](responsive-confirmation.json) records the final corrected six-width and landscape matrix; all have equal scroll/client widths. The corresponding homepage screenshots were replaced with settled captures. A fresh visual reviewer validated the captures and scored all three requested fixes resolved: lettering cuts, short landscape composition and durable product/design documentation. That verdict covers those fixes only.

## Sampled text contrast

Parent-collected CUA computed colors were checked using the standard WCAG relative-luminance formula: `(Llighter + 0.05) / (Ldarker + 0.05)`, after sRGB linearization.

| Sample | Text RGB | Solid background RGB | Contrast ratio |
| --- | --- | --- | ---: |
| Main text and outlined action | 234, 243, 250 | 6, 18, 31 | 16.78:1 |
| Muted footer text | 175, 189, 203 | 6, 18, 31 | 9.84:1 |
| Primary action (`::before`) and contact band | 234, 243, 250 | 19, 87, 245 | 5.04:1 |

These sampled solid-background combinations exceed 4.5:1. Coverage is limited to these samples; it does not cover every artwork pixel or interaction state and is not full WCAG certification.

## Performance diagnostics limitation

Official Lighthouse13.6.0 was installed separately under the ignored task QA-tools directory; Chrome156.0.8078.74 was available. A bounded audit was attempted against the gzip static preview using a fresh temporary Chrome profile, mobile defaults, simulated throttling and CPU slowdown4. The requested command was:

```powershell
$env:CHROME_PATH='C:/Program Files/Google/Chrome/Application/chrome.exe'
& 'C:/Users/USER/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe' .superpowers/sdd/2026-11-02-midnight-network/qa-tools/node_modules/lighthouse/cli/index.js http://127.0.0.1:4173/ --output=json --output=html --output-path=docs/verification/lighthouse-mobile --only-categories=performance,accessibility,best-practices,seo --throttling-method=simulate --throttling.cpuSlowdownMultiplier=4 --chrome-flags='--headless=new --no-first-run --force-prefers-no-reduced-motion' --save-assets --no-enable-error-reporting --quiet
```

The sandbox run exited1: `Runtime error encountered: waiting for dynamic debugging port in chrome-err.log`, originating from chrome-launcher `checkReady`. The identical escalated retry did not execute to a result; its pending approval was interrupted. No Lighthouse result/trace exists. CPU hardware inspection through CIM was denied. No user Chrome profile, sandbox-disable flag, interactive browser automation or remote reporting was used.

Therefore scores, CPU/network-observed LCP/CLS/TBT and active/inactive effect traces are unavailable. The declared CPU slowdown and mobile settings are attempted configuration, not successful measurements. No field INP, percentile or physical-device performance claim is made. Asset budgets are measured independently above; loading/stability targets remain unverified until a permitted lab run and eventual field evidence.
