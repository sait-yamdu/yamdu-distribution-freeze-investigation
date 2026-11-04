#!/bin/bash
cd /home/user/yamdu-distribution-freeze-investigation/investigation/evidence/run-20261029T0510Z
for c in 1 2 3; do timeout 300 node scripts/cyc2.js $c 75; echo "r2 cyc $c exit $?" >> loop2.out; done; echo LOOP2DONE >> loop2.out
