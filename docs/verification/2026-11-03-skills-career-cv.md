# Original CV, skills and career roadmap

Implemented the owner's actual CV download, a separate Skills section and a roadmap-style Experience section. The reference at https://zulfiqaralam18.github.io/ informed the dated vertical route; its copy was not reused. Midnight Network's existing palette, typography, background effects and project collection remain intact.

## Content and PDF

- Skills groups are supported by the supplied rendered CV and approved project history: Agentic AI, Interfaces, Backend & data, Delivery & integration and Design. No proficiency scores or outcome claims were invented.
- All five existing experience records, periods, summaries and their most-recent-first order are preserved. Dates use month-precision time elements. The current role has both a filled milestone and a text label.
- The supplied James Gatoru Curriculum Vitae PDF was visually inspected and copied byte-for-byte. The source was not modified. Original, public asset, build snapshot, HTTP-served file and browser-downloaded file all have SHA-256 `db58c05b74b3708f772d0185a5ac49c72219ddcbbd3c97bec502d2c6f9ab763c` (1,509,638 bytes).
- About and footer downloads point to this asset with the original document filename. The old derivative generator is now an explicit source-copy helper.

## Fresh checks

- Production build passed with 17 verification HTML pages, including 13 project pages.
- 134 Vitest tests and 5 Node verification tests passed. The new initial-HTML checks failed against the prior snapshot before the new build, then passed: Skills, career facts/order, navigation and both download attributes are present before hydration.
- Static output checker reported no errors; type checking and whitespace checks passed.
- Asset budgets passed: maximum initial JavaScript 141,485 bytes gzip; mobile hero 51,232 bytes; conservative mobile homepage estimate 328,419 bytes. The new sections add no client component, library or animation loop. The CV is downloaded on demand and is not part of that homepage transfer estimate.

## Browser evidence

Reviewed the running Next.js preview at 1440×1000, 768×1024, 390×844 and 320×740. No horizontal document/section overflow was found. Desktop Skills has an AI anchor and four supporting disciplines; tablet has two columns; phone has one. The career route keeps its date column at tablet/desktop and puts dates above roles on mobile. The mobile Skills navigation closes the disclosure and reaches the correct fragment. The actual PDF was downloaded and its hash checked. No real email was sent.

Local review captures are retained under ignored `tmp/skills-career-review/`: desktop-skills.jpg, desktop-experience.jpg, mobile-skills.jpg, mobile-experience.jpg, mobile-skills-complete.png and mobile-experience-complete.png. Full-section mobile images are crops of the actual rendered sections, not mockups. An independent read-only reviewer inspected all six captures and implementation/docs and returned **ship**, with no actionable findings.

These are local browser and build checks, not physical-device or throttled performance measurements. No deployment or GitHub push was requested for this refinement.
