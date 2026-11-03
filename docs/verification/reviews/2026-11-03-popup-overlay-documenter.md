# Mobile confirmation overlay — documenter verification

Disposition: aligned after one scoped prose correction.

Checked only the overlay records in `DESIGN.md` and the Contact band description in `.impeccable/design.json` against `src/components/contact-confirmation.tsx` and `src/styles/contact.css`, with supplied evidence from `docs/verification/2026-11-03-popup-overlay.md` and the scoped ship review in `docs/verification/reviews/2026-11-03-popup-overlay-visual.md`. No code, tests, browser, real email or Git mutations were performed in this pass.

Correction: the preceding notification paragraph in `DESIGN.md` still said “without a backdrop or floating shadow.” Removed the stale backdrop prohibition, retaining “without a floating shadow.” The new overlay paragraph and sidecar Contact band description already match the source and required no change. Token primitives and component previews remain untouched.

Five-line contract:

1. Visibility: the backdrop is hidden by default and displayed only at 767px and below.
2. Surface: a fixed full-viewport `rgb(2 8 16 / 28%)` navy veil adds no blur or shadow.
3. Layering: backdrop z-index 79 remains below the opaque popup at 80.
4. Interaction: the decorative `aria-hidden` element is pointer-transparent and adds no focus or modal behavior.
5. Lifetime: backdrop and popup share mounting and every dismissal path, including the existing 5,000ms timer; no separate timer is introduced.

Not canonized or repaired: previously reported PRODUCT live-verification history drift remains outside this mobile-overlay record check. No broader system changes were inferred from the refinement.
