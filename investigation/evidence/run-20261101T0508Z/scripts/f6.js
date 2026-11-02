const L=require('./lib');
(async()=>{const {p}=await L.conn();
await p.evaluate(()=>{window.__vis=[];document.addEventListener('visibilitychange',()=>window.__vis.push([Date.now(),document.visibilityState]));window.__jank=[];});
L.log('PENDING search FRZ-Ext-1101 in recipients');
await p.mouse.click(180,179);await p.keyboard.type('FRZ-Ext-1101',{delay:80});await p.waitForTimeout(2500);
await p.screenshot({path:L.EV+'/16-search.png'});
process.exit(0)})().catch(e=>{console.log('ERR',e.message);process.exit(1)});
