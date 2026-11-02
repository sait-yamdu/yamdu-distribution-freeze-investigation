const {chromium}=require('/tmp/claude-0/w/node_modules/playwright-core');
const fs=require('fs');
const EV='/home/user/yamdu-distribution-freeze-investigation/investigation/evidence/run-20261011T0513Z';
exports.EV=EV;
exports.log=(o)=>fs.appendFileSync(EV+'/steps.jsonl',JSON.stringify({t:new Date().toISOString(),...o})+'\n');
exports.sleep=ms=>new Promise(r=>setTimeout(r,ms));
exports.conn=async()=>{const b=await chromium.connectOverCDP('http://localhost:9222');const ctx=b.contexts()[0];return {b,ctx,p:ctx.pages()[0]};};
