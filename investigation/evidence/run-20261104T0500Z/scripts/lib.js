const {chromium}=require('playwright');const fs=require('fs');
const EV='/home/user/yamdu-distribution-freeze-investigation/investigation/evidence/run-20261104T0500Z';fs.mkdirSync(EV,{recursive:true});
exports.EV=EV;
exports.log=m=>{fs.appendFileSync(EV+'/steps.log',new Date().toISOString()+' '+m+'\n');console.log(m)};
exports.conn=async()=>{const b=await chromium.connectOverCDP('http://localhost:9222');const c=b.contexts()[0];const p=c.pages().find(x=>/scotty/.test(x.url()))||c.pages()[0];return {b,p,c}};
