#!/bin/bash
A=$1; E=/home/user/yamdu-distribution-freeze-investigation/investigation/evidence/run-20261008T0759Z/$A/; mkdir -p $E
export NODE_PATH=$(npm root -g)
echo "attempt $A start $(date -u +%FT%TZ)" > $E/timeline.txt
/tmp/w/fresh_nopw.sh >> $E/timeline.txt 2>&1
/tmp/w/rec.sh $E/screen.mp4; echo "recording started $(date -u +%FT%TZ)" >> $E/timeline.txt
cd /home/user/yamdu-distribution-freeze-investigation
EV=$E LOG=$E/steps.jsonl timeout 900 node /tmp/w/r_r4.js; rc=$?; echo "driver rc=$rc $(date -u +%FT%TZ)" >> $E/timeline.txt
/tmp/w/hangcap.sh $E $rc
