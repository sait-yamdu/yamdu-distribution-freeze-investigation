const {conn,log,EV}=require('./lib');
(async()=>{const {b,p}=await conn();
log('PENDING recipients');
await p.evaluate(()=>{window.__vis=[];document.addEventListener('visibilitychange',()=>window.__vis.push([Date.now(),document.visibilityState]));});
for(const y of [244,441,576,711]){await p.mouse.click(471,y);await p.waitForTimeout(600);}
await p.getByText(/^Recipients \(\d+\)/).first().click();await p.waitForTimeout(1200);
log('counter after depts: '+await p.getByText(/^Recipients \(\d+\)/).first().innerText());
await p.screenshot({path:EV+'/06-recips.png'});
await b.close();})();
