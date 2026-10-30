const {chromium}=require('playwright');
const fs=require('fs');
const EV='/home/user/yamdu-distribution-freeze-investigation/investigation/evidence/run-20261030T0500Z';
fs.mkdirSync(EV,{recursive:true});
const LOG=EV+'/steps.log';
exports.log=m=>{fs.appendFileSync(LOG,new Date().toISOString()+' '+m+'\n');console.log(m)};
exports.EV=EV;
exports.conn=async()=>{const b=await chromium.connectOverCDP('http://localhost:9222');const c=b.contexts()[0];const p=c.pages()[0]||await c.newPage();return {b,p}};
