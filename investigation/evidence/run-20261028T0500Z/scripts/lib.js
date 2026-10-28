const {chromium}=require('/opt/node-tools/node_modules/playwright-core');
const fs=require('fs');
const EV='/home/user/yamdu-distribution-freeze-investigation/investigation/evidence/run-20261028T0500Z';
exports.EV=EV;
exports.log=(o)=>fs.appendFileSync(EV+'/steps.jsonl',JSON.stringify({t:new Date().toISOString(),...o})+'\n');
exports.sleep=ms=>new Promise(r=>setTimeout(r,ms));
exports.conn=async()=>{const b=await chromium.connectOverCDP('http://localhost:9222');const ctx=b.contexts()[0];const pages=ctx.pages().filter(p=>p.url().includes('scotty')||p.url()==='about:blank');return {b,ctx,p:pages[0]};};
// liveness probe: round-trip ms, node count, heap MB, visibility
exports.probe=async(p,label)=>{const t=Date.now();try{const r=await Promise.race([p.evaluate(()=>({n:document.getElementsByTagName('*').length,h:performance.memory?Math.round(performance.memory.usedJSHeapSize/1048576):-1,vis:document.visibilityState,sc:document.scripts.length})),new Promise((_,j)=>setTimeout(()=>j(new Error('PROBE_TIMEOUT')),10000))]);const o={probe:label,ms:Date.now()-t,...r};exports.log(o);return o;}catch(e){exports.log({probe:label,PROBE_FAIL:e.message});return null;}};
