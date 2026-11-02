# Implementation decisions

These record the implementation rulings and the cost of changing them.

- Used the selected checkout on `codex/midnight-network`: the initial repository had no HEAD for a worktree. Changing this means relocating the new checkout later.
- Created the meaningful static-output checker with routes in Task3 rather than an unused Task1 stub. Cost if wrong: a small file-ownership adjustment.
- Kept hosting outside scope under the approved local-only brief. Cost: a separate deployment/domain step when requested.
- Parent produced original image assets while a single task implementer wrote product code. Cost: asset handoff coordination; source images/prompts are retained.
- Continued with direct project context and the approved comps after the Impeccable launcher failed. Automated comp measurement and detector checks were unavailable. Cost: manual comparison, with the limitation recorded explicitly.
- Allowed Task2 to establish a usable homepage shell for its required browser checks, with Task3 extending it. Cost: a small shared-file handoff.
- Widened the display lettering toward the approved concept while reserving its width in layout. Cost: a bounded typography adjustment if the owner prefers different proportions.
- Kept unmeasured lab, zoom and physical-device targets explicit rather than asserting success after the failed/pending audit attempts. Cost: later permitted lab/device verification; asset size checks are separate evidence.

The local branch and source workspace are retained for the owner. No remote push, merge, hosted Site registration or publishing occurred.
