disposition: ship

Scope: existing-popup centring and five-second dismissal only. No new direction contract, QUALITY BAR card, comp-diff or detector output was supplied; those broader build gates are not re-certified by this review. Reviewed the two named popup viewport excerpts, source delta, complete popup/form/CSS source, DESIGN.md, PRODUCT.md and craft floor. Test/build results are the supplied verification record; no suites were rerun.

## persistence

Pass. PRODUCT.md and DESIGN.md exist and retain the approved Midnight Network world. DESIGN.md records mobile centring at 767px and below, desktop lower-right placement and the requested 5,000ms automatic dismissal. The explicit owner request supersedes the earlier no-auto-dismiss rule. Both authoritative screenshot files exist, show the complete success popup and contain usable contact/footer context; they are excerpts, not full-page captures.

## fidelity

| Element | Disposition | Evidence |
| --- | --- | --- |
| Mobile position | adaptation | Owner-requested centring; the mobile excerpt shows the whole notification horizontally centred over the form, without clipping. Supplied DOM measurements place its centre at half the document width and viewport height. |
| Desktop position | match | Desktop excerpt retains the lower-right notification; supplied measurements report 38.39px right and 24px bottom clearance. |
| TYPE | match | Condensed italic Barlow Condensed heading and Exo 2 copy retain the established scale relationship and legibility in both excerpts. |
| MATERIAL | match | Opaque navy field, thin cyan edge, opposing angular corners and authored geometric check remain consistent with DESIGN.md. No imitation physical material is introduced. |
| GROUND | match | Existing navy popup ground and cobalt contact surface remain unchanged in the source delta and visible captures. |
| Motion and reduced motion | match | Entrance keyframes preserve the mobile translation throughout the 14px arrival; desktop uses zero translation defaults. Reduced-motion removal retains the base mobile centring transform. |
| Five-second lifetime | adaptation | Owner-requested timeout is created in the popup effect and cleared on cleanup. The parent's recorded tests establish visibility at 4,999ms and dismissal at 5,000ms; captures establish appearance rather than timing. |
| Lifecycle and interaction | match | `useCallback([])` keeps `onDismiss` stable across parent renders, so an unrelated render does not restart the timer. Unmount removes both the timer and Escape listener. A new appearance mounts a fresh timer. Manual close, Escape, field reentry and a new valid submission still dismiss; inline/live confirmation remains after dismissal, and focus returns to submit only when it was inside the popup. |

## ceiling

Reached for this bounded refinement. The existing angular frame, cyan linework, condensed lettering and finite check/entrance motion remain intact. The two excerpts show adequate copy and close-control clearance. No additional visual device is needed to satisfy the request. Wider responsive, physical-device and screen-reader coverage remains limited as disclosed in the verification record.

## material_fixes

None. The selector-wait tool timeout is correctly distinguished from the later DOM confirmation of removal and the exact fake-clock boundary; it is not presented as a passing browser timing test.

## keep

Preserve the navy/cyan frame, Barlow Condensed/Exo 2 pairing, desktop placement, nonmodal interaction, persistent inline status, stable callback and timer/listener cleanup.
