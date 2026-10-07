#!/bin/bash
E=$1; rc=$2
DISPLAY=:99 timeout 10 import -window root $E/end-screen.png
if [ "$rc" = "3" ]; then
  PID=$(ps -eo pid,pcpu,args --sort=-pcpu | grep "[t]ype=renderer" | head -1 | awk '{print $1}')
  echo "renderer pid $PID" > $E/hang-diag.txt
  for i in 1 2 3; do date -u +%T >> $E/hang-diag.txt; top -b -n2 -d2 -p $PID | tail -1 >> $E/hang-diag.txt; grep VmRSS /proc/$PID/status >> $E/hang-diag.txt; timeout 40 gdb -p $PID -batch -ex "thread apply 1 bt 7" 2>&1 | grep -E "^#[0-6] " | cut -c1-140 >> $E/hang-diag.txt; echo -- >> $E/hang-diag.txt; DISPLAY=:99 timeout 10 import -window root $E/hang-screen-$i.png; sleep 20; done
fi
sleep 3; kill -INT $(cat /tmp/w/rec.pid) 2>/dev/null; sleep 2
echo "capture done $(date -u +%FT%TZ)" >> $E/timeline.txt
