# Findings (cumulative)

- Status: no freeze reproduced; no root cause. Historical H1-H7 imported negatives (2026-10-03, Windows, Chromium 152).
- Run 20261006T1158Z: BLOCKED (scotty egress 403). Run 20261006T1215Z: scotty reachable; login (two-step: email -> Next -> password) and project #5551 verified.
- Lead (build difference): the Distribution sharing modal editor in the current scotty build is TipTap/ProseMirror. Historical Froala-leak simulation (H4) may not reflect this build; treat H4 negative as not applicable to this editor.
- E1 (16 recipients + 6 files incl. 37 MB, Enter, Check recipients): NOT REPRODUCED. E3 (CDP freeze/resume 15/45/90 s, modal open, draft save): NOT REPRODUCED. E2 (true hidden transitions): BLOCKED - hidden state not attainable in cloud Chromium; editors were not recreated while 'visible'.
- Cannot confirm/refute the prior report of editor destruction while hidden.
