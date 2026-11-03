# Midnight Network motion refinement

The owner requested smooth popup/backdrop entrance and exit, more animation across links/buttons/arrows and removal of link underlines. Existing blue/cyan identity, responsive performance, reduced motion and the stationary city remain binding.

## Motion thesis

- **Focal moment:** an accepted enquiry arrives as the existing angular cyan confirmation; its mobile background tint fades with it. The five-second dismissal begins a short exit instead of removing visible elements abruptly.
- **Continuity:** a small, once-per-view entrance marks section headings and project introductions as visitors reach them. Content stays visible before enhancement and if scripting/observation is unavailable.
- **Feedback:** directional arrow travel, short action press/hover movement, colour changes, focus/input transitions and responsive project/filter feedback make actual interactive controls feel connected. Remove anchor underlines; retain conspicuous keyboard focus and recognizable link colours/placement.
- **Budget:** CSS opacity/transform/colour transitions, one bounded IntersectionObserver with completed targets unobserved, finite sequences only. No dependencies, blur, video, forced intro, background parallax or new continuous loops. Reduced motion removes spatial effects while retaining immediate state feedback.

## Execution

- [x] Popup: retain the confirmation while its 180ms exit runs; coordinate popup/backdrop fades and cancel stale timers on reopen/unmount. Keep the public `open` intent separate from present/closing DOM. Pending/error paths cannot show a newly accepted success. Manual/Escape/focus/timeout dismissal remain coherent, with the inline live confirmation preserved. Cover presence, interruption, timer and reduced-motion CSS paths without sending emails.
- [x] Site: add a shared motion stylesheet and a narrow client enhancement for once-visible heading/project introductions. Links have no underline; hover/focus colours and directional arrow feedback remain legible. Buttons acknowledge hover/press; touch and reduced-motion paths remain usable. Do not animate city artwork or alter project facts/screenshots.
- [x] Verify: targeted behavioural tests then the complete build/suite/static/asset checks. Browser QA at desktop, actual preview width and mobile, including popup exit phase, mobile dimmer, desktop no-dimmer, underline removal, keyboard/touch paths and reduced-motion sources. Use only mock submission QA; no additional real email.
- [x] Finish: independent scoped visual/code review and design-document reconciliation, local commit and refreshed preview. No deployment/push or changes to private Resend configuration.

Popup implementation owns `contact-confirmation.tsx`, `contact-form.tsx`, `contact-form.test.tsx` and `contact.css`. Main implementation owns the shared stylesheet, section-motion enhancement/tests and layout import. These file boundaries allow independent work without editing the same files.
