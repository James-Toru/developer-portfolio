# Page transitions and GitHub publication

**Goal:** Connect the homepage, archive and project pages with short, lightweight fades, then push the verified portfolio to the owner's developer-portfolio repository.

**Architecture:** Keep existing ordinary HTML anchors and full-document navigation. Opt same-origin documents into native CSS cross-document view transitions only when motion is permitted. No new dependency, route interception, navigation delay or JavaScript is needed. Browser history, fragment links, downloads and external links retain their native behavior; unsupported browsers navigate normally.

## Motion thesis

The existing success popup remains the focal authored moment. Navigation uses a quiet opacity handoff between the existing navy pages so that moving between project collections and a project feels continuous. Desktop arrival lasts 220ms and departure 160ms; at 767px and below use 160ms/120ms. Avoid geometry interpolation, zoom, slides, blur and shared-image morphs. Reduced motion opts out of cross-document transitions. Existing artwork remains stationary, and section/control motion stays intact.

## Execution

- [x] Add shared CSS opt-in and finite root snapshot fades in `src/styles/motion.css`. Read installed Next navigation guidance and primary browser documentation before implementation. No implementation-mirroring CSS tests; verify actual compiled CSS and browser navigation.
- [x] Merge current rules into DESIGN.md and its sidecar, with README support/fallback guidance. Preserve identity and unrelated content.
- [x] Build, run the complete suite/static checker and compressed-asset budgets. Verify desktop/mobile home → archive → project → back/home, fragments and no overflow in one batched browser pass. No form submissions or email sends.
- [x] Independent scoped review; record screenshots and measured limits. Commit, add the explicit GitHub origin and push to the empty repository's `main` without force. Verify the remote ref equals the local commit. Keep the local preview available.

## Publication boundary

The owner explicitly requested pushing to https://github.com/James-Toru/developer-portfolio.git. Repository read check returned no refs. Keep real `.env.local` ignored; confirm no secrets are tracked or present in historical commits before pushing. Do not alter visibility, create a deployment, force-push or modify unrelated repositories.

References: [MDN CSS @view-transition](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@view-transition), [Chrome cross-document transitions](https://developer.chrome.com/docs/web-platform/view-transitions/cross-document), installed `node_modules/next/dist/docs/01-app/02-guides/view-transitions.md`. Next's React transition integration is available but unnecessary for the existing full-document links.
