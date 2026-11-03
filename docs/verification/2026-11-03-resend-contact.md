# Resend contact form — 2026-11-03

The owner approved Resend delivery to `gatorumbugua@gmail.com`, a Name/Email/Message form and a Next.js backend. The portfolio now uses a Next.js server; the content pages remain pre-rendered. `out/` is a freshly generated verification snapshot, not the application deployment output.

This record describes implementation QA. A later owner-authorized [live onboarding-sender test](2026-11-03-resend-live-test.md) confirmed real Resend acceptance; Gmail inbox arrival remains awaiting owner confirmation.

## Backend evidence

Task 1 at `deb8150`: 39 focused backend tests, the full 87-test Vitest suite and five Node utility fixtures passed. The production build and TypeScript checks passed. Static verification found 17 HTML mappings, 13 project pages, 71 files and no errors. A temporary production server returned homepage HTTP 200 and unconfigured contact HTTP 503 with `Cache-Control: no-store`.

Controller inspection of the actual build manifests confirmed the pre-rendered homepage/archive/project routes and the separate server `/api/contact/route`. No `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `api.resend.com` or `contact-handler` markers were found in `.next/static` browser files. The task-scoped review approved the backend with no blocking issues; an optional upstream-response byte cap was recorded for final review.

## Integrated form verification

At `b36c201`, the controller ran `pnpm build` (including TypeScript and fresh verification snapshot generation), `pnpm test`, the static checker and asset measurement. All completed successfully: **100 Vitest tests across seven files plus five Node utility fixtures**, 17 HTML mappings, 13 project pages, 71 checked files and no static errors. The form task review approved spec compliance and quality with no blocking findings.

The production Next.js preview is running at `http://127.0.0.1:4173/`, with its sender/key deliberately blank and its allowed origin set to the local URL. The old static preview was stopped after it occupied that port; the replacement serves both pages and the real contact endpoint. No fake email-success path is included.

Actual browser checks:

- Homepage clientWidth/scrollWidth matched at 320px (305px), 390px (375px), normal 610px (595px), and desktop 1440px (1425px). Archive at normal width also matched 595px and contained one form with the three required fields.
- Body remains Exo 2 and the contact heading remains Barlow Condensed.
- Submitting empty fields focused Name; malformed email focused Email and was invalid. A subsequent valid synthetic submission returned the unavailable state, preserved all three values and re-enabled submission. No mail was sent.
- Keyboard Tab moved from Name to Email; the focused input had a visible 2px light outline. The form's status was exposed in the accessibility tree with an email recovery link.
- Source-color calculations give 5.04:1 for light labels on cobalt and 16.78:1 for input text on navy. This scoped calculation does not certify every state or surface.
- Viewport overrides were reset after checks. Captures are declared contact-section/form excerpts, not whole-page screenshots: `contact-desktop-1440.jpg`, `contact-mobile-390.jpg`, `contact-mobile-320.jpg`, `contact-normal-610.jpg`, and `contact-unavailable-610.jpg` under `screenshots/2026-11-03/`. Every saved image was inspected; all three fields and submit control are visible in each form capture. Native captures are slightly soft at desktop emulation size.

[Asset measurements](asset-sizes-2026-11-03-resend-contact.json): maximum modern initial JavaScript 139,308 bytes gzip; mobile hero 51,232 bytes; conservative mobile homepage 323,051 bytes. All existing size budgets pass. These are file-size estimates rather than CPU, network or field measurements.

A repeat marker scan of the final `.next/static` files found no delivery-key, configured-sender, provider-URL or server-handler references.

The [final feature code review](reviews/2026-11-03-resend-contact-code.md) found no actionable Critical, Important or Minor findings. The [visual finish review](reviews/2026-11-03-resend-contact-visual.md) returned `ship` for the approved contact extension and all five declared captures. The documenter verified PRODUCT.md, DESIGN.md and the design sidecar against the shipped form, CSS and tokens; no further changes or scoped drift were found. These verdicts do not establish live email delivery or public deployment readiness.

## Delivery and scope limits

No real email was sent during implementation QA. Provider tests used mocked HTTP responses, and that local browser QA used an unconfigured/disabled sender. The subsequent live test is recorded separately above. A domain-verified production sender remains future setup; local testing now uses Resend's restricted onboarding sender.

The basic throttle is bounded and process-local: three attempts per normalized email and 60 globally per ten minutes. It resets on restart and is separate across instances; public deployment needs shared/edge rate controls. No hosting, account registration, secret transmission or deployment is included.

Existing physical-device, throttled-performance, actual 200% browser zoom and field-performance limitations remain. Automated checks and viewport emulation do not certify universal device performance or WCAG conformance.
