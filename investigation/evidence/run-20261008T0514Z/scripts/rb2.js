const {chromium}=require('playwright');
(async()=>{
 const b=await chromium.connectOverCDP('http://localhost:9222'); const p=b.contexts()[0].pages()[0];
 const snap=()=>p.evaluate(()=>({scripts:document.scripts.length,mk:window.__mk||null}));
 await p.evaluate(()=>{window.__mk='same-doc'});
 const hs=(process.env.HS||'').split(',');
 for(const h of hs){
   const before=await snap(); await p.evaluate(h=>{location.hash=h},h); await p.waitForTimeout(5000);
   const a=await snap(); console.log(h.padEnd(45),'url',p.url().slice(-40),'scripts',before.scripts,'->',a.scripts,'doc-kept',a.mk);
   await p.evaluate(()=>{location.hash='#5551/announcements:files:filedistribution'}); await p.waitForTimeout(2500);
 }
 process.exit(0)})();
