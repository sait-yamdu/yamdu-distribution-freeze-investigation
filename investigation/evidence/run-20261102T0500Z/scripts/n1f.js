const L=require('./lib');
(async()=>{const {p}=await L.conn();
L.log('N1 step6 PENDING close modal');
await p.mouse.click(1291,36);await p.waitForTimeout(2500);await p.screenshot({path:L.EV+'/07-close.png'});
L.log('N1 step6 DONE');process.exit(0)})().catch(e=>{console.log('ERR',e.message);process.exit(1)});
