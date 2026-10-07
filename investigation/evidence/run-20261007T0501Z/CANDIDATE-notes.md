# Candidate freeze CF1 (E4, run-20261007T0501Z)
- Onset: between 05:06:44Z (external-email-entry done) and 05:07:09Z (type-greeting-enter step exceeded 25s); first bounded evaluate timeout 05:07:19Z.
- Last pending action: keyboard.type("Meine Lieben,", delay 60ms) then Enter in the sharing-modal ProseMirror editor (Playwright, CDP-attached, trusted key events).
- State: 8 checkboxes ticked -> "Recipients (4)" (Abbie Considine, Giulia Esposito, Moritz Test, test External ama); an external e-mail was typed into the Recipients field + Enter in this cycle (result not visible in text: 'Add new e-mail address' button present on Recipients tab); subject "Freeze probe E4 cycle 1"; one earlier (pilot) cycle in same tab/login had saved a draft and reopened Drafts list. Session: login 05:03Z, no reload, ~4 min age.
- Renderer main thread (pid 513): state R, 105-116% CPU, 4+ min and counting, RSS 451->461 MB. CDP Runtime/Debugger commands never answer (Debugger.enable timeout), connectOverCDP page attach times out.
- gdb samples (no symbols for JS): main thread alternates among blink::Node::removeChild (LayoutObjectChildList::RemoveChildNode, Range::NodeWillBeRemoved) called from JS (v8 RemoveChildOperationCallback) and Table layout (TableRowLayoutAlgorithm / BlockLayoutAlgorithm) => JS loop doing DOM removals with forced layout of a table; not a hang in a network/IO wait.
- Confound: Chrome "Save password?" bubble (browser UI) visible in screenshot candidate-xvfb.png; unsupported --no-sandbox infobar; no window manager.
- Page unresponsive dialog NOT shown (no WM / headed Xvfb).
