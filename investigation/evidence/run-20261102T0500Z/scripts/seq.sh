for i in 1 2 3; do node hide.js 60; sleep 2; node visr.js; node ent.js v$i; done
echo SEQ_DONE >> $EVD/steps.log
