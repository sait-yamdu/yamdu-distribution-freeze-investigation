#!/bin/bash
# usage: wmhide.sh SECS  -> minimize chrome window via WM, wait, restore; logs visibility via CDP
EV=$(dirname $0)/..; S=${1:-60}
W=$(wmctrl -l | grep -i 'Chrome' | head -1 | cut -d' ' -f1)
xdotool windowminimize $(printf %d $W); echo "$(date -u +%FT%T.%3NZ) WMHIDE start ${S}s" >> $EV/steps.log
sleep 3; node -e "const L=require('./lib');(async()=>{const {p}=await L.conn();L.log('state during hide='+await p.evaluate(()=>document.visibilityState));process.exit(0)})()"
sleep $S
wmctrl -i -a $W; sleep 2; echo "$(date -u +%FT%T.%3NZ) WMHIDE end" >> $EV/steps.log
node -e "const L=require('./lib');(async()=>{const {p}=await L.conn();L.log('after restore '+await p.evaluate(()=>JSON.stringify([document.visibilityState,(window.__vis||[]).map(x=>x[0])])));process.exit(0)})()"
