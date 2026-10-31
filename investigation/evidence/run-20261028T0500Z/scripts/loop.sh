#!/bin/bash
cd /home/user/yamdu-distribution-freeze-investigation/investigation/evidence/run-20261028T0500Z
for c in 2 3 4 5 6 7 8; do h=75; [ $c = 4 ] && h=150; [ $c = 7 ] && h=150; timeout 400 node scripts/cyc.js $c $h; echo "cyc $c exit $?" >> loop.out; done
echo LOOPDONE >> loop.out
