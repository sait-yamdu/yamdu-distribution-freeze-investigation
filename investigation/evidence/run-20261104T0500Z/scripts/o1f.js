const L=require('./lib');
(async()=>{const {p}=await L.conn();
L.log('O1 step6 PENDING select 3 files');
for(const [x,y] of [[770,375],[1022,375],[770,625]]){await p.mouse.click(x,y);await p.waitForTimeout(700)}
await p.screenshot({path:L.EV+'/09-sel.png'});
L.log('O1 step6 DONE');process.exit(0)})().catch(e=>{console.log('ERR',e.message);process.exit(1)});
