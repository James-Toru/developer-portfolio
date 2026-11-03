# Resend Contact Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Add the approved contact form and a server-only Resend delivery endpoint.

**Architecture:** Use a native Next.js POST Route Handler and a small client form in the shared contact section. Replace static-only export with the Next.js server while retaining pre-rendered pages. Verification creates an ignored snapshot from the actual server build for the existing content/link/asset checks; production runs Next.js, not that snapshot.

**Tech Stack:** Existing Next.js 16.4.3, React 19.3.1, TypeScript, native fetch, Vitest and native CSS. No additional service or runtime dependency is required.

**Spec:** `docs/superpowers/specs/2026-11-03-resend-contact-design.md`, approved 2026-11-03.

## Global Constraints

- Fixed recipient: gatorumbugua@gmail.com. A validated visitor email is Reply-To; the sender is configured on the server.
- Name 100 characters, email 254 characters, message 5,000 characters; all required.
- API keys stay server-only, ignored and absent from logs/browser bundles. No real messages are sent during automated tests or local QA.
- Preserve Midnight Network, Exo 2 body and Barlow Condensed display typography, existing project content and stationary city.
- No deployment, account creation, attachments, database or automatic replies.
- Honest unavailable response when configuration is absent; retain direct email links and failed drafts.

## Review Focus

- Escaped/multibyte input and streamed oversized bodies must not bypass the body bound (Task 1).
- Recipient/sender injection must not turn the endpoint into an open relay (Task 1).
- Unconfigured local preview must render and report an honest unavailable state (Tasks 1–2).
- Rapid submits, a slow network and retries must preserve drafts without duplicate requests (Task 2).
- Build checks must read a fresh Next.js build rather than stale static export files (Task 1).

## Task 1: Backend and runtime migration

**Files:** Create `src/lib/contact-contract.ts`, `src/lib/contact-handler.ts`, `src/lib/contact-handler.test.ts`, `src/app/api/contact/route.ts`, `scripts/prepare-verification-output.mjs`, `.env.example`; modify `next.config.ts`, `package.json`, `.gitignore`, `src/lib/static-output.test.ts`, verification scripts as needed.

**Interfaces:**
- JSON POST `/api/contact/` consumes `{ name: string, email: string, message: string, website?: string }`.
- `ContactResponse = { ok: true } | { ok: false; error: string; fieldErrors?: Partial<Record<ContactField, string>> }`, with `ContactField = 'name' | 'email' | 'message'`, exported from the shared contract. Export field limits for client use.
- Successful provider acceptance returns 200/ok true. Validation 400, wrong origin 403, payload size 413, media type 415, throttle 429, missing configuration 503, provider/network failure 502/504. Error responses use the shared contract, cache-control no-store, and no raw provider details.
- Server config: `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_ORIGIN` (public origin, required in production; local request origin fallback allowed). Fixed recipient comes from existing profile. Use Resend REST API via native fetch with a 10-second provider timeout.
- Bound body to 64 KiB while reading the stream, checking declared size too. Trim and validate required fields/lengths/email, disallow control characters in single-line fields; plain-text message. Honeypot nonempty returns a no-send response. Limit per-instance accepted attempts to 3 per 10 minutes by validated email plus a bounded global ceiling; bounded expiring map, no untrusted proxy-header dependency. Document this is basic protection and public hosting needs shared/edge limits.
- `pnpm build` creates the normal Next.js server build then a fresh ignored `out/` verification snapshot from `.next/server/app` prerendered HTML, `.next/static` and `public`. Snapshot includes proper index/404 mappings and excludes server-only code. Existing static checker/size tool operate on this generated snapshot; preview uses `next start --hostname 127.0.0.1 --port 4173`.

- [ ] Write failing backend tests for success, fixed addresses/Reply-To, invalid fields/types, size including streamed bodies, origin/content type, honeypot, throttle expiry/cap, configuration and upstream errors/timeout; test snapshot mapping with fixtures.
- [ ] Run focused tests and observe failures before implementation.
- [ ] Implement the contract/handler/route, runtime/config changes, placeholder example and fresh snapshot preparation; preserve old utility functions where fixture tests depend on them.
- [ ] Run focused tests, production build and existing snapshot/static checks. Confirm the server route is dynamic while portfolio pages remain pre-rendered. Report commands/results; do not send email.
- [ ] Commit the task, then obtain task-scoped spec/quality review before Task 2.

## Task 2: Responsive form, documentation and local review

**Files:** Create `src/components/contact-form.tsx`, `src/components/contact-form.test.tsx`, `src/styles/contact.css`; modify `src/components/contact.tsx`, global stylesheet imports or layout imports, README.md, PRODUCT.md and focused DESIGN.md/sidecar entries if a reusable form rule is introduced. Add verification record/screenshots.

**Interfaces:** Consume Task 1's field limits and `ContactResponse`. Submit JSON to `/api/contact/` with same-origin fetch. No delivery credentials or server imports in client code.

- [ ] Write failing component tests for labels/limits, pending duplicate prevention, success reset, failed draft preservation/retry, malformed/network responses and validation errors. Use existing React act/createRoot conventions.
- [ ] Run focused tests, then build the form and responsive shared contact composition. Native required/email validation plus authoritative backend errors, hidden honeypot, keyboard-visible focus, live status, clear recovery and email fallback. Disable submission before client readiness; noscript points to the direct email link.
- [ ] Keep form fields stable during pending submission so success cannot erase newly edited content. Announce provider acceptance as sent, not guaranteed inbox delivery. No success state for an unconfigured server.
- [ ] Update setup/runtime documentation with ignored local secrets, verified sender, origin, Next.js hosting and host-level abuse controls. Mark spec approved/implemented only as evidence supports.
- [ ] Run build, full existing/new tests, static checker and asset measures once. Controller starts the real server preview and verifies mobile/desktop and actual user width, keyboard states and unavailable delivery without a real send. Save screenshots; record live delivery unverified.
- [ ] Commit and obtain task-scoped spec/quality review; then final integration review, Impeccable finish reviewer/documenter and a clean local commit. Keep the updated preview open; no push or deployment.

## Execution notes

The owner explicitly approved implementation and previously chose subagent implementation/review. Continue in the existing authorized checkout on `codex/midnight-network`, with sequential implementers and scoped reviewers. Do not add another approval gate for this internal plan. Controller handles browser QA, final verification evidence and commits if worker sandbox Git writes fail. Baseline is 9d78da1; prior typography checks passed 52 tests and build.
