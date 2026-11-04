const {chromium}=require('playwright-core');const fs=require('fs');
const EV=process.env.EVD;const secs=+process.argv[2]||60;
const lg=m=>fs.appendFileSync(EV+'/steps.log',new Date().toISOString()+' '+m+'\n');
(async()=>{const b=await chromium.connectOverCDP('http://localhost:9222');const s=await b.newBrowserCDPSession();
const {targetInfos}=await s.send('Target.getTargets');const orig=targetInfos.find(t=>t.type==='page'&&/scotty/.test(t.url));
const w0=await s.send('Browser.getWindowForTarget',{targetId:orig.targetId});
const {targetId:nt}=await s.send('Target.createTarget',{url:'about:blank',newWindow:false});
const w1=await s.send('Browser.getWindowForTarget',{targetId:nt});
lg('windows orig='+w0.windowId+' new='+w1.windowId+' bounds0='+JSON.stringify(w0.bounds));
if(w1.windowId!==w0.windowId){await s.send('Browser.setWindowBounds',{windowId:w1.windowId,bounds:{...w0.bounds,windowState:'normal'}});}
await s.send('Target.activateTarget',{targetId:nt});
lg('HIDE start '+secs+'s');
await b.close().catch(()=>{});
await new Promise(r=>setTimeout(r,secs*1000));
const b2=await chromium.connectOverCDP('http://localhost:9222');const s2=await b2.newBrowserCDPSession();
await s2.send('Target.activateTarget',{targetId:orig.targetId});await s2.send('Target.closeTarget',{targetId:nt});lg('HIDE end');await b2.close().catch(()=>{});process.exit(0)})().catch(e=>{lg('hide2 ERR '+e.message);process.exit(1)});
