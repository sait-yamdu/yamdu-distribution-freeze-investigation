const L=require('./lib');
(async()=>{const {p}=await L.conn();
L.log('N1 step2 PENDING open kebab of FRZ-Ext-1101');
await p.mouse.click(1305,464);await p.waitForTimeout(1500);await p.screenshot({path:L.EV+'/03-menu.png'});
L.log('N1 step2 DONE');process.exit(0)})().catch(e=>{console.log('ERR',e.message);process.exit(1)});
