# RAXOS implementation reference

Reviewed: 2026-11-02
Repository: https://github.com/James-Toru/raxos-website
Pinned commit: 9f68e20ee9b94f6df88b996b8e1a68da00a34de3
Purpose: user-authored implementation reference for the approved Midnight Network portfolio, not a replacement visual design.

## Source evidence

- package.json: Next.js 16.2.10, React 19.2.7, TypeScript, Framer Motion, Three.js, Nodemailer and Vitest. These are observed reference versions, not an instruction to copy every dependency or an assertion that each is the best current version.
- src/components/interface-chrome.tsx and src/app/globals.css: angular frame layers, clipped corners and small interface labels.
- src/components/brand-stage.tsx: separately layered tower artwork and brand content; scroll transforms respect useReducedMotion.
- src/components/interactive-background.tsx: distinct desktop/mobile profiles, 30/22 FPS caps, capped device-pixel ratio, passive pointer listeners and cleanup. Its hidden-document branch still schedules requestAnimationFrame, so use event-driven cancellation in the portfolio rather than copying that loop.
- src/components/custom-cursor.tsx: a persistent cursor render loop; global CSS hides native cursors on fine pointers. Portfolio keeps native cursors and confines pointer reactivity to the hero.
- src/components/site-boot-sequence.tsx: image/font readiness, body scroll lock and a minimum display time. The approved portfolio has immediately available content and no boot gate.
- src/components/three-operative.tsx and cinematic-contact.tsx: a Three.js operative/contact sequence with FBX and GLB assets. Portfolio uses direct email/LinkedIn and layered 2D artwork.
- public/raxos-tower.avif: 79,006 bytes, compared with 128,978-byte WebP and 1,939,801-byte PNG variants in the source tree. This demonstrates a useful local image-optimization pattern.
- globals.css: mobile rules at 800px and 420px include large fixed minimum heights and positioned brand content. Portfolio uses flowing content and intrinsic sizing as required by its brief.
- globals.css reduced-motion rule globally collapses durations. Portfolio uses explicit nonessential-effect gating and stable static states.

## Reuse and adaptation

Adapt the angular corner geometry, readable metadata hierarchy, layered artwork organization and multiple optimized image variants. Retain Midnight Network's blue palette, skyline, typography and asymmetrical composition. Effects are locally scoped, progressively enhanced, independently stoppable and available only when user preference and input capability allow.

Write focused components instead of importing the full RAXOS landing shell or 1,903-line stylesheet. The portfolio does not need the reference's full client-side shell, Framer Motion, Three.js, server enquiry route, Nodemailer, custom cursor, boot screen, or corporate branding.

Use original portfolio artwork generated from the selected concept; do not ship the RAXOS tower or brand marks as James's hero without a deliberate owner request. RAXOS itself remains in the portfolio archive as a verified user-authored project.

## Reviewed source links

- https://github.com/James-Toru/raxos-website/blob/9f68e20ee9b94f6df88b996b8e1a68da00a34de3/package.json
- https://github.com/James-Toru/raxos-website/blob/9f68e20ee9b94f6df88b996b8e1a68da00a34de3/src/app/globals.css
- https://github.com/James-Toru/raxos-website/blob/9f68e20ee9b94f6df88b996b8e1a68da00a34de3/src/components/brand-stage.tsx
- https://github.com/James-Toru/raxos-website/blob/9f68e20ee9b94f6df88b996b8e1a68da00a34de3/src/components/interactive-background.tsx
- https://github.com/James-Toru/raxos-website/blob/9f68e20ee9b94f6df88b996b8e1a68da00a34de3/src/components/interface-chrome.tsx

