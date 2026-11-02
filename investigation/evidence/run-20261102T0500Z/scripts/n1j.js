const L=require('./lib');
(async()=>{const {p}=await L.conn();
L.log('N1 step8 PENDING click Delete');
await p.mouse.click(1178,552);await p.waitForTimeout(2000);await p.screenshot({path:L.EV+'/11-del-confirm.png'});
L.log('N1 step8 DONE (confirm shown?)');process.exit(0)})().catch(e=>{console.log('ERR',e.message);process.exit(1)});
