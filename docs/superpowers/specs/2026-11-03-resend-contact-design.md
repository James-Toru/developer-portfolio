# Resend contact form

Status: approved by the owner on 2026-11-03, including the Resend backend, required form fields and implementation. Live delivery still requires owner configuration.

## Intent and scope

Let prospective clients and employers send an enquiry from the portfolio to the confirmed inbox, **gatorumbugua@gmail.com**. The owner chose Resend with a backend after considering Formspree. Preserve Midnight Network, Exo 2 reading text, Barlow Condensed display headings, the stationary city and the existing project collection.

This is a focused contact feature with a required hosting change, rather than a redesign. No accounts, attachments, newsletter subscription, database or automatic replies are proposed.

## Approaches

- **Formspree:** fits the existing static export and handles delivery externally. The owner declined it and selected Resend.
- **Resend with a backend:** selected by the owner. Provides a server-controlled sender, recipient and email contents. Requires a Resend API key, a verified sending domain and a host that can run the backend.

The implementation proposal is to use a native Next.js Route Handler in the existing application rather than add a separate service. Remove static-only `output: "export"`, retain pre-rendered portfolio/project pages, and use `next start` for the local production preview. A static-file-only host will no longer run the complete application. Hosting provider and public deployment remain outside this local change.

## Form and behaviour

Extend the existing shared contact section, which appears on the homepage and work archive. Keep the direct email and social links. Place an accessible, visibly labelled form beside the contact introduction on wide screens and below it on mobile, using the established cobalt/navy palette and square controls.

Fields: Name, Email and Message, all required. Proposed limits: name 100 characters, email 254 characters and message 5,000 characters. Use native autocomplete and email validation, plus matching authoritative server validation. No additional required business or budget questions.

Show a pending state and prevent duplicate submissions while a request is active. Announce success or failure accessibly. Preserve the draft on network/provider failure and permit retry; clear it only after the backend confirms acceptance. Do not report a message as delivered to the inbox merely because the provider accepted it. Keep the direct email link available if scripting or delivery is unavailable.

## Delivery and configuration

`POST /api/contact/` validates the request and sends through Resend from a server-configured address on the owner's verified domain. The recipient is fixed to the confirmed inbox; the visitor's validated email becomes Reply-To. Visitors cannot choose recipients or sending addresses. A bounded plain-text email contains the name, email and message.

Keep `RESEND_API_KEY` and the configured sender in server-only environment variables. Provide a committed example containing placeholders and setup instructions; actual credentials stay ignored and are never requested in chat. No real messages, API keys or provider response bodies are logged.

When delivery configuration is absent, the backend returns an honest unavailable response and the form offers the existing email link. Local validation/error-state review does not require a real API key. Live inbox delivery remains unverified until the owner configures Resend and a verified sender, then explicitly requests or performs a real submission.

## Boundaries and abuse controls

Apply a bounded request-body size, same-origin checks, a hidden honeypot, request timeout and a bounded per-instance submission throttle. These are modest protections; an in-memory throttle is not a shared quota across serverless instances. Document the need for host-level rate limits when publishing, without adding a database or another paid service to this local feature. Do not expose raw provider errors to visitors or erase their draft on failure.

## Verification and builder choices

Add meaningful backend tests with mocked Resend responses for valid delivery, invalid fields, oversized requests, wrong-origin requests, honeypot submissions, throttling, absent configuration and provider failure. Test the client pending/success/failure/draft-retention behaviour without sending email. Update the existing build-output checks and asset measurements to inspect the pre-rendered Next.js server build rather than stale `out/` files.

Build and run the application, check the shared form at mobile and desktop widths, exercise keyboard labels/focus and submission states, and retain local screenshots. Existing responsive and reduced-motion behaviour remains required. The builder may choose implementation details, exact layout proportions, field styling and concise feedback copy within these constraints.

## Owner setup still needed for live delivery

A Resend account and server API key, a verified sending domain and its sender address. These can be configured after the local implementation; no secret or purchased service is needed to review the form itself.

## Sources checked

- Installed Next.js guides: Route Handlers, Deploying, Static Exports and Environment Variables under `node_modules/next/dist/docs/`.
- [Resend Next.js integration](https://resend.com/docs/send-with-nextjs)
- [Resend send-email API](https://resend.com/docs/api-reference/emails/send-email)
- [Resend pricing](https://resend.com/pricing), checked 2026-11-03. Free usage has limits; no unlimited-free or hosting-cost guarantee is implied.
