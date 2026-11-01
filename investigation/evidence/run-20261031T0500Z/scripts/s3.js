const {conn,log,EV}=require('./lib');
(async()=>{const {b,p}=await conn();
log('PENDING open room');
await p.mouse.click(795,590); await p.waitForTimeout(3500);
await p.mouse.click(385,400); await p.waitForTimeout(3500);
await p.getByText('Select multiple').first().click(); await p.waitForTimeout(1500);
await p.screenshot({path:EV+'/03-sel.png'});
log('DONE selmode url='+p.url());
await b.close();})();
