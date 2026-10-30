#!/bin/bash
A=$1; E=/home/user/yamdu-distribution-freeze-investigation/investigation/evidence/run-20261007T0840Z/$A/; mkdir -p $E
export NODE_PATH=$(npm root -g) YU='sait@yamdu.com' YP="$PW"
echo "attempt $A start $(date -u +%FT%TZ)" > $E/timeline.txt
/tmp/w/fresh.sh >> $E/timeline.txt 2>&1
# original CF1 session: open.js/ex*.js exploration opened Add modal + 3-dot menu before pilot
cd /tmp/w; node open.js >/dev/null 2>&1; node ex.js >/dev/null 2>&1; node ex3.js >/dev/null 2>&1; echo "exploration prelude done $(date -u +%FT%TZ)" >> $E/timeline.txt
/tmp/w/rec.sh $E/screen.mp4; echo "recording started $(date -u +%FT%TZ)" >> $E/timeline.txt
cd /home/user/yamdu-distribution-freeze-investigation
PILOT=1 EV=$E LOG=$E/steps-1-pilot.jsonl MIN=45 timeout 200 node /tmp/w/r_pilot.js; echo "pilot rc=$? $(date -u +%FT%TZ)" >> $E/timeline.txt
EV=$E LOG=$E/steps-2-e4-driver.jsonl MIN=8 timeout 700 node /tmp/w/r_e4b.js; rc=$?; echo "e4 rc=$rc $(date -u +%FT%TZ)" >> $E/timeline.txt
/tmp/w/hangcap.sh $E $rc
