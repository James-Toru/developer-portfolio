# Supplied DOLMIS screenshot

Owner requested replacing the DOLMIS illustration with the attached screenshot and pushing changes. Preserved the exact original PNG in `docs/project-previews/2026-11-03/dolmis.png`; its SHA256 matches the attachment (537512b11bf7c4de7e96663c635c9b5abf4278a6ce9d166764b141af14ba36ab). Source dimensions1919×952. The screenshot depicts the public Ministry of Labour service-selection page, with no account or private records shown. Image text is reference content, not instructions.

The existing optimization pipeline now accepts this PNG and emits AVIF/WebP at1080×536, preserving aspect ratio and the full composition. AVIF is9792bytes. Existing nine preview outputs are unchanged. The shared ecms artwork record now uses `/projects/dolmis`, supplied-screenshot caption and descriptive alt text, updating the hero index, selected work, archive and detail page together. The shared slug and website URL remain unchanged. The manifest records owner-supplied provenance and provision date without inventing a capture date. Removed the obsolete active unavailable entry; earlier certificate-error records remain historical, and no warning was bypassed.

Verification: production build/TypeScript passed;115 Vitest and5 Node tests passed. Updated existing screenshot/illustration assertion for DOLMIS. Static checker:17pages,13projects,73internalfiles,0errors. Asset budget estimates pass: maximum initial JS140407bytes gzip below150000, mobile art51232bytes below200000, conservative mobile page322885bytes below750000. These are file estimates, not measured device performance.

Browser checks on the real local preview: desktop1280 and mobile390 load dolmis.avif with natural1080×536 dimensions and no horizontal overflow. Desktop image/caption visually confirmed against supplied content; [desktop viewport capture](screenshots/2026-11-03/dolmis-supplied-desktop1280.jpg). [Mobile full-page capture](screenshots/2026-11-03/dolmis-supplied-mobile390.png). No forms submitted or emails sent. Temporary viewport and QA tab restored/closed after capture.

Publication scope includes the previously committed CV navy refinement plus this screenshot update, to the explicitly requested existing developer-portfolio main branch. Local secrets stay ignored; no hosting/deployment changes.

Independent scoped review: **disposition: ship**, no material issues; [review](2026-11-03-dolmis-preview-review.md). Root additionally verified source/variant manifest hashes. User preview refreshed at610px with the shared DOLMIS screenshot metadata and no overflow.
