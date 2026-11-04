const L=require('./lib');
(async()=>{const {p}=await L.conn();
L.log('PENDING open QA Root room');await p.mouse.click(437,540);await p.waitForTimeout(3500);
await p.screenshot({path:L.EV+'/12-room.png'});
process.exit(0)})().catch(e=>{console.log('ERR',e.message);process.exit(1)});
