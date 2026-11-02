---
name: Midnight Network — James Gatoru
description: A rain-lit city portfolio with clear work, live typography and optional atmosphere.
colors:
  cobalt: "#1357f5"
  cyan: "#29dce8"
  coral: "#f56f68"
  background: "#06121f"
  surface: "#0b1b2b"
  text: "#eaf3fa"
  muted: "#afbdcb"
typography:
  display:
    fontFamily: "'Barlow Condensed', sans-serif"
    fontSize: "clamp(8.5rem, 12.6vw, 12.5rem)"
    fontWeight: 800
    lineHeight: 0.84
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "'Barlow Condensed', sans-serif"
    fontSize: "clamp(2.2rem, 4.2vw, 4rem)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "0.025em"
  title:
    fontFamily: "Barlow, sans-serif"
    fontSize: "clamp(1.35rem, 2vw, 1.8rem)"
    fontWeight: 600
    lineHeight: 1.1
  body:
    fontFamily: "Barlow, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Barlow, sans-serif"
    fontSize: "clamp(0.85rem, 1.25vw, 1.125rem)"
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: "0.095em"
rounded:
  square: "0"
spacing:
  "8": "8px"
  "12": "12px"
  "16": "16px"
  "20": "20px"
  "24": "24px"
  "32": "32px"
  "40": "40px"
  "64": "64px"
  gutter: "clamp(20px, 4vw, 64px)"
components:
  button-primary:
    backgroundColor: "{colors.cobalt}"
    textColor: "{colors.text}"
    rounded: "{rounded.square}"
    padding: "12px 24px"
    height: "54px"
  button-outline:
    backgroundColor: "{colors.background}"
    textColor: "{colors.text}"
    rounded: "{rounded.square}"
    padding: "12px 24px"
    height: "54px"
  search-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    typography: "{typography.body}"
    rounded: "{rounded.square}"
    padding: "12px 16px"
    height: "52px"
  category-filter:
    textColor: "{colors.text}"
    rounded: "{rounded.square}"
    padding: "8px 16px"
    height: "44px"
  category-filter-selected:
    backgroundColor: "{colors.cyan}"
    textColor: "{colors.background}"
    rounded: "{rounded.square}"
    padding: "8px 16px"
    height: "44px"
---

# Design System: Midnight Network

## Overview

**Creative North Star: "Midnight Network"**

Midnight Network presents James Gatoru’s work inside a rain-lit, layered city. Blue atmosphere, ice-white lettering and cyan interface edges create an immersive setting; generous live typography and direct links keep the work legible and reachable.

The visual rhythm moves between expressive artwork and calm reading surfaces. Condensed italic display type supplies energy, while ordinary Barlow supports project narratives and controls. Atmosphere is a progressive enhancement: the complete composition and content exist before optional movement.

**Key Characteristics:**

- Original city imagery with navy, cobalt and cyan depth.
- Large, live condensed italic headings with restrained angular details.
- Open project rows and thin rules rather than repeated floating panels.
- Optional, locally scoped motion and a complete static presentation.

This record describes the implemented source in `src/app/globals.css`, `src/styles/` and the associated components, including the final static letter cuts and short-landscape rules. The approved [desktop](concepts/cyberpunk-midnight-network-v2.png) and [mobile](concepts/cyberpunk-midnight-mobile-v1.png) concepts establish the chosen world. [Screenshots](docs/verification/screenshots/) and the [responsive matrix](docs/verification/responsive-matrix.json) are review evidence, not numeric fidelity scores. The Impeccable launcher, automated comp-diff and detector were unavailable, so comparison was manual. Lighthouse could not complete because Chrome’s debugging port was inaccessible; the escalated retry remained unresolved and was aborted. LCP, CLS, TBT and INP have not been demonstrated, and actual 200% browser zoom was not verified. These are verification limits, not visual-system rules.

## Colors

A dark blue foundation supports bright, purposeful interface signals; exact primitives are normative in the frontmatter and match the source custom properties.

### Primary

- **Cobalt:** filled primary actions and the contact band. It gives important destinations a broad, unmistakable surface.

### Secondary

- **Cyan:** rules, navigation feedback, link accents, selected filters and focus outlines. Use background-colored text on cyan fills.

### Tertiary

- **Coral:** the small slash accent in the hero role and signals within the artwork. It remains a minor note.

### Neutral

- **Background:** the page foundation and opaque reading ground.
- **Surface:** capabilities, search and expanded mobile navigation.
- **Text:** primary reading and display type.
- **Muted:** supporting copy, dates, metadata and illustrative-image labels.

**The Signal Hierarchy Rule.** Cobalt carries filled actions, cyan carries interface edges and feedback, and coral remains a small signal.

## Typography

**Display Font:** Barlow Condensed, with sans-serif fallback, italic and weight 800.
**Body Font:** Barlow, with sans-serif fallback, weights 400 and 600.

Both families are locally served WOFF2 subsets. There is no separate monospace face and no body-font custom property; the existing display property is `--font-display`.

### Hierarchy

- **Display:** the frontmatter records the desktop hero. The base hero uses `clamp(4.6rem, 22vw, 10rem)`, tablet uses `clamp(8rem, 17vw, 11rem)`, and short landscape uses `clamp(3.5rem, 8vw, 4.25rem)`. Name lines are uppercase live spans, horizontally extended within reserved layout width.
- **Headline:** italic, uppercase section headings. Archive and project headings use a larger contextual clamp; this does not change the family pairing.
- **Title:** semibold Barlow for project, experience and capability titles. Selected project titles increase to `clamp(1.7rem, 3vw, 2.6rem)`.
- **Body:** regular Barlow, with paragraphs limited to 70 characters where the global rule applies. Larger introduction copy uses fluid sizing and shorter line lengths.
- **Label:** the frontmatter records the uppercase technical role. Small controls and image captions use regular Barlow at `.875rem`; labels are not a new display family.

**The Live Type Rule.** Keep identity, headings, labels and controls as real HTML; artwork never replaces readable content.

## Layout

The shared content width is capped at 1600px with the fluid gutter token. Common sections use a two-column relationship around 1:1.3, broad gaps and vertical spacing that grows with the viewport. Thin dividers separate rows without boxing every paragraph.

At 1024px and above, the hero uses an asymmetric `1.85fr` text column and a `minmax(280px, 1fr)` project index. The name’s horizontal extension is accounted for by reserved heading width. At 1023px and below the hero becomes a single column with the index in normal flow; its three-column tablet index becomes stacked rows at 767px and below. Project, archive, capability and narrative layouts also collapse at that mobile boundary. Filters wrap.

Short landscape screens from 600–1023px wide, at no more than 500px high, use a compact hero: 24px top padding, a smaller name and reduced spacing keep identity and primary action accessible while the index follows in normal flow. This is a composition adaptation, not a fixed-height viewport lock.

Mobile uses a dedicated portrait city asset; desktop uses the landscape asset. Images retain intrinsic dimensions, long project headings can wrap, and the document scrolls natively. Interactive targets generally reserve at least 44px in each applicable direction; main actions are taller. Preserve reflow rather than shrinking the desktop canvas.

## Elevation & Depth

Depth comes primarily from original city artwork, the dark fade into the page and opaque tonal surfaces. The city itself is an image, not a synthetic collection of CSS gradients; the CSS gradient is a legibility overlay. Cards do not receive a general floating shadow.

### Shadow Vocabulary

- **Hero text separation:** `0 4px 30px #03142266` supports large lettering against the city.
- **Expanded mobile navigation:** `0 16px 24px #0005` separates the open menu from the document.

**The Art Carries Atmosphere Rule.** Let imagery carry the cinematic depth; keep long reading surfaces calm and opaque.

Only the city art responds to eligible pointer input. The source caps pointer displacement at 10px per axis and coalesces work into requested frames. Art transition is 200ms with `cubic-bezier(.16, 1, .3, 1)`; the localized rain cycle is 3500ms. Interface color transitions in the hero are 180ms ease-out. These values describe the shipped effects, not proof of device performance.

## Shapes

The form language is square and angular. Primary and outlined actions use opposing clipped corners (18px outer cut, 17px inner outline cut), not a radius. Inputs, filters and effects controls retain square edges. Fine cyan or muted strokes establish boundaries.

The name’s two live spans use a static 174-degree mask with a narrow transparent gap rising through the letterforms. This cut belongs to the identity treatment; it is not looping distortion or a replacement for the text. The corner bracket beside the hero name is a small framing detail.

## Components

### Buttons

Condensed, italic and direct. Primary actions use cobalt; secondary actions use a cyan clipped outline around the background surface. Both use the frontmatter padding and a minimum height rather than a forced fixed height; mobile reduces the minimum to 52px. Labels and the inline SVG arrow share one hit target. Hover changes the primary fill or the outlined action’s inner surface. The hero’s active state turns text cyan.

### Inputs / Fields

Search is a full-width square field up to 620px wide, using the surface background, readable text and a muted stroke. The caret and focus outline are cyan. Keep its visible label and useful placeholder; the application exposes all projects before filtering becomes available.

### Chips

Category filters are rectangular buttons with a wrapping layout. Selected state uses a cyan fill, background-colored text and `aria-pressed`; unselected state is transparent with a muted border. Hover strengthens the border. Reset filters uses cyan text.

### Cards / Containers

Project presentation uses open rows and image plates rather than elevated card tiles. Selected work alternates the image/copy relationship on desktop and restores a consistent image-first order on mobile. Archive rows combine title, honest kind label, description, technologies and category, with responsive column collapse. Illustrative plates retain visible captions.

### Navigation

Desktop navigation sits beside the condensed wordmark and a thin cyan rule. Mobile uses a labeled native Menu disclosure with a surface-colored dropdown. Links keep at least 44px of usable height. Hover is cyan; global keyboard focus is a 2px cyan outline with 5px offset. The menu closes on a link activation and Escape restores focus to its trigger.

### Effects Control

Auto and Off are adjacent square buttons with a visible Effects label. The pressed state combines a darker blue surface, brighter text and cyan border. Auto respects reduced motion and input capabilities. Off is stored locally where possible. Enhancements stop offscreen and in hidden documents; touch and reduced-motion visitors retain the complete static city.

### Contact Band

A broad cobalt surface closes the page with a condensed italic heading, a wrapping direct email link and profile links. Use white focus outlines on this band to keep keyboard feedback visible. It is an email destination, with no simulated form submission.

## Do's and Don'ts

### Do:

- **Do** preserve the cobalt action, cyan interface and minor coral signal hierarchy.
- **Do** keep all meaningful text and actions in HTML, with actual links and inline SVG icons.
- **Do** reserve width for extended display lettering and let content reflow on narrow or short screens.
- **Do** pair expressive imagery with quiet reading surfaces and visible illustrative-image labels.
- **Do** provide keyboard focus, touch-sized controls and a complete reduced-motion presentation.

### Don't:

- **Don't** introduce acid yellow into the selected Midnight Network identity.
- **Don't** turn the city composition into a full-page screenshot containing baked-in text.
- **Don't** make information depend on hover, parallax, a forced intro or looping text distortion.
- **Don't** extend hero atmosphere into constant animation across reading sections.
- **Don't** turn every paragraph or archive record into a floating, shadowed card.

