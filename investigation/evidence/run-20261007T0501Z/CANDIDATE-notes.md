# Candidate freeze CF1 (E4, run-20261007T0501Z)
- Onset: between 05:06:44Z (external-email-entry done) and 05:07:09Z (type-greeting-enter step exceeded 25s); first bounded evaluate timeout 05:07:19Z.
- Last pending action: keyboard.type("Meine Lieben,", delay 60ms) then Enter in the sharing-modal ProseMirror editor (Playwright, CDP-attached, trusted key events).
- State: 8 checkboxes ticked -> "Recipients (4)" (Abbie Considine, Giulia Esposito, Moritz Test, test External ama); an external e-mail was typed into the Recipients field + Enter in this cycle (result not visible in text: 'Add new e-mail address' button present on Recipients tab); subject "Freeze probe E4 cycle 1"; one earlier (pilot) cycle in same tab/login had saved a draft and reopened Drafts list. Session: login 05:03Z, no reload, ~4 min age.
- Renderer main thread (pid 513): state R, 105-116% CPU, 4+ min and counting, RSS 451->461 MB. CDP Runtime/Debugger commands never answer (Debugger.enable timeout), connectOverCDP page attach times out.
- gdb samples (no symbols for JS): main thread alternates among blink::Node::removeChild (LayoutObjectChildList::RemoveChildNode, Range::NodeWillBeRemoved) called from JS (v8 RemoveChildOperationCallback) and Table layout (TableRowLayoutAlgorithm / BlockLayoutAlgorithm) => JS loop doing DOM removals with forced layout of a table; not a hang in a network/IO wait.
- Confound: Chrome "Save password?" bubble (browser UI) visible in screenshot candidate-xvfb.png; unsupported --no-sandbox infobar; no window manager.
- Page unresponsive dialog NOT shown (no WM / headed Xvfb).

# Candidate freeze CF2 (confirmation 2, fresh browser profile + fresh login 05:11:46Z)
- Driver e4b = same e4 driver from a fresh session. Cycle 1 completed normally (open modal, 8 ticks, external email entry, subject, greeting+Enter+text, 30 s idle, Check recipients skipped, Save as draft, close, nav files/scenes, nav Distribution > Drafts).
- Hang at 05:15:26Z-05:16:01Z during step "reopen-draft": click draft row 'Freeze probe E4 cycle 1' (4 recipients) -> modal reopened with draft content (screenshot candidate-conf2-xvfb.png shows modal rendered, Recipients (4), all department headers ticked), then click editor/End/Enter/type 'reopened 1' pending.
- Renderer pid 1395: R state 108% CPU, RSS 663 MB (higher than CF1 at 451-461 MB). gdb samples (conf2-gdb-samples.txt): Node.insertBefore + MutationObserver::EnqueueMutationRecord, Table constraint-space free, mojo send -> DOM insert/remove churn plus table layout, same signature as CF1 (removeChild/Range::NodeWillBeRemoved/TableRowLayout).
- Confirmation 1 (cf.js conf1, fresh login, no prior draft, same hang-site sequence incl. external email + 'Meine Lieben,' + Enter): NOT reproduced.
