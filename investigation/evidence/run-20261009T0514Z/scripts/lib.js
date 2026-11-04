const {chromium}=require('/opt/node-tools/node_modules/playwright');
const fs=require('fs');
const EV='/home/user/yamdu-distribution-freeze-investigation/investigation/evidence/run-20261009T0514Z';
exports.EV=EV;
exports.log=(o)=>fs.appendFileSync(EV+'/steps.jsonl',JSON.stringify({t:new Date().toISOString(),...o})+'\n');
exports.conn=async()=>{const b=await chromium.connectOverCDP('http://localhost:9222');const ctx=b.contexts()[0];return {b,ctx,pages:()=>ctx.pages()};};
