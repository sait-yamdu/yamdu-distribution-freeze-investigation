#!/bin/bash
# Exact CF2 replay: fresh profile+login -> cf.js conf1 -> e4b (probe-bug abort is skipped: it did nothing but log+fatal) -> e4b MIN=8
A=$1; E=/home/user/yamdu-distribution-freeze-investigation/investigation/evidence/run-20261007T0840Z/$A/; mkdir -p $E
export NODE_PATH=$(npm root -g) YU='sait@yamdu.com' YP="$PW"
echo "attempt $A start $(date -u +%FT%TZ)" > $E/timeline.txt
/tmp/w/fresh.sh >> $E/timeline.txt 2>&1
/tmp/w/rec.sh $E/screen.mp4
echo "recording started $(date -u +%FT%TZ)" >> $E/timeline.txt
cd /home/user/yamdu-distribution-freeze-investigation
EV=$E LOG=$E/steps-1-conf1-sequence.jsonl timeout 150 node /tmp/w/r_cf.js conf1; echo "cf.js rc=$? $(date -u +%FT%TZ)" >> $E/timeline.txt
EV=$E LOG=$E/steps-2-e4b-driver.jsonl MIN=8 timeout 700 node /tmp/w/r_e4b.js; rc=$?; echo "e4b rc=$rc $(date -u +%FT%TZ)" >> $E/timeline.txt
/tmp/w/hangcap.sh $E $rc
