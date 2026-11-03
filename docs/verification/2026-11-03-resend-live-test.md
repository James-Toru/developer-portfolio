# Resend onboarding sender test — 2026-11-03

The owner explicitly requested testing with `onboarding@resend.dev` and messages sent to `gatorumbugua@gmail.com` while no domain is owned.

An API key was already present in the ignored `.env.local`. Its value was preserved and was not displayed or committed. Only the local sender and allowed origin were set to `onboarding@resend.dev` and `http://127.0.0.1:4173`. The local Next.js preview was restarted using the saved runtime configuration.

Exactly one live test was submitted through the actual browser contact form:

- Name: Portfolio delivery test
- Recipient and Reply-To: gatorumbugua@gmail.com
- Subject: Portfolio enquiry from Portfolio delivery test
- Message: This is a test enquiry from the Midnight Network portfolio contact form, sent using Resend’s onboarding sender. No reply is needed.

The form changed from disabled Sending to “Message sent — accepted for delivery. Thank you for getting in touch.” All fields cleared and the action became available again. The backend produces this success only after Resend returns a successful response with an acceptance id. This verifies real provider acceptance; the owner must still confirm arrival in Gmail inbox/spam. No additional submissions were made.

Actual browser evidence: [accepted submission](screenshots/2026-11-03/contact-resend-live-accepted.jpg).

The [Resend testing-sender restriction](https://resend.com/docs/knowledge-base/403-error-resend-dev-domain) limits `onboarding@resend.dev` to the email associated with the Resend account. No public deployment, DNS change, domain purchase or application-code change was made. Existing build/test results remain applicable; no suite was rerun for this runtime-only configuration change.
