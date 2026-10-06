# Findings (cumulative)

- Status: BLOCKED (no experiment has run in the cloud yet). Historical H1-H7 are imported negatives from 2026-10-03 (Windows, Chromium 152).
- No freeze reproduced. No root cause established.
- Blocker: scotty.yamdu.com unreachable from the cloud environment (egress proxy returns 403 on CONNECT).
