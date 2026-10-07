# Findings (cumulative)

- Status: candidate REPRODUCED in cloud (run-20261007T0501Z): 2 persistent renderer hangs (CF1, CF2) out of 3 attempts. Not minimized; root cause unproven.
- Signature: renderer main thread pinned >100% CPU for minutes (still running when killed), memory growing (451->461 MB; 663 MB), DevTools commands unanswered. Native stack samples show JS calling Node.removeChild/insertBefore, MutationObserver record enqueue and table layout (TableRowLayoutAlgorithm) repeatedly = busy DOM mutation loop, i.e. not I/O or a one-shot slow layout. This is consistent with an infinite/very long re-render loop; not a proven leak and not Enter-specific.
- CF1: in sharing modal after typing 'Meine Lieben,' (Enter pending), 4 recipients (8 ticks incl. dept/dupes), external e-mail typed; a draft had been saved earlier in same tab.
- CF2: reopening a saved draft (4 recipients) from Distribution > Drafts in a fresh session.
- Not reproduced: E4-C1 (fresh session, no saved draft, identical modal sequence incl. external e-mail + 'Meine Lieben,' + Enter).
- Leading hypothesis H8: existing saved draft with recipients / external-email contact + modal reopen or following modal open drives a render loop. Needs minimization (see state.json next_experiment).
- Confounds: Chrome Save-password bubble in both screenshots; Xvfb/no WM; CDP-driven; Chromium 141 on Linux (customer: Chrome on macOS/Windows, Firefox, Safari NOT TESTED). The prior run's reading (editor recreation while hidden) is not needed to explain these hangs (page stayed visible).
- Earlier (2026-10-06) runs: E1/E3 not reproduced, E2 blocked; those had no saved-draft-then-reopen preceding state except E3 (saved draft, never reopened).
