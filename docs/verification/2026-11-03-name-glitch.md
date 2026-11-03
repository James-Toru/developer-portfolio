# Hero name glitch

The owner requested a glitch effect on the hero name. The underlying James / Gatoru lettering, scale, static diagonal cut and layout remain unchanged. Empty, aria-hidden overlay spans use CSS pseudo text copies clipped into two thin bands. They shift at most four pixels in a .34-second stepped burst every 8.5 seconds, with a .14-second offset between words. No whole-heading flicker or layout motion is added.

The existing signal observer now includes #hero-title, using the same viewport, document visibility, reduced-motion and Effects Auto/Off gates. Unsupported enhancement leaves the actual name readable. CSS also disables the overlay animations for reduced motion. There are no extra observers, timers, frame loops, animation dependencies or font assets.

Fresh checks: production build passed; 136 Vitest plus 5 Node tests passed; static checker found zero errors across 17 pages/13 project pages. The lifecycle test includes the hero in its visibility/preference/cleanup coverage. Asset budgets passed: maximum initial JavaScript 141,689 bytes gzip; mobile hero 51,232 bytes; conservative homepage estimate 329,130 bytes.

Browser checks at 1440×1000 and 390×844 confirmed the name keeps its existing scale and the document has no horizontal overflow. Both decorative spans are aria-hidden, with the original live name unchanged. Effects Off removes the name animation; Auto restores it while visible. Captures are retained under ignored tmp/name-glitch/desktop.png and mobile.png. These captures show normal readable frames; the intermittent motion is inspected in the running preview and computed styles, not proved by a still image. No email was sent and no physical-device performance claim is made.
