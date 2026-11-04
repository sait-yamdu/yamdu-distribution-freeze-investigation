#!/bin/bash
A=$1; E=/home/user/yamdu-distribution-freeze-investigation/investigation/evidence/run-20261007T0905Z/$A/; mkdir -p $E
export NODE_PATH=$(npm root -g)
echo "attempt $A start $(date -u +%FT%TZ)" > $E/timeline.txt
/tmp/w/fresh.sh >> $E/timeline.txt 2>&1
/tmp/w/rec.sh $E/screen.mp4; echo "recording started $(date -u +%FT%TZ)" >> $E/timeline.txt
cd /home/user/yamdu-distribution-freeze-investigation
EV=$E LOG=$E/steps.jsonl timeout 400 node /tmp/w/r_valid.js; rc=$?; echo "driver rc=$rc $(date -u +%FT%TZ)" >> $E/timeline.txt
/tmp/w/hangcap.sh $E $rc
