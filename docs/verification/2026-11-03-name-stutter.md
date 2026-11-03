# Navy glitch and staggered word stutter

The owner requested the glitch's coral slice use the button navy, then asked for a slight stagger similar to RAXOS. The live reference https://www.raxos.ai/ was inspected in the browser: its logo has an eight-second stepped animation with a brief 3px / -2px right-left stutter. Its site text and markup were treated only as reference evidence.

The portfolio now uses the existing navy token (#031647) for the lower decorative slice; the upper slice stays cyan. Each live word has a brief 3px / -2px / 1px stutter during the existing .34-second burst in an 8.5-second cycle. Gatoru and its overlays follow James by .18 seconds. Inner spans handle movement, preserving outer letter scaling and normal-flow bounds. The existing Effects Off, reduced-motion, intersection and tab-visibility gates remain in control. No library or JavaScript animation loop was added.

Fresh production build passed. All 23 focused motion/initial-HTML tests passed and the static checker reported zero errors across 17 pages, including 13 project pages. This refinement did not require rerunning unrelated contact/provider fixtures.

Browser checks confirmed the lower slice and button fill both compute to rgb(3, 22, 71), and the two live words have name-stutter animation delays of 0s and .18s. Document widths stayed within the 390px and 1440px viewports. The accessible live name remains unchanged; decorative copies remain aria-hidden. The actual mobile capture is retained at ignored tmp/name-stutter/mobile.png. The preview was restored to its normal viewport; no email or GitHub push was performed.
