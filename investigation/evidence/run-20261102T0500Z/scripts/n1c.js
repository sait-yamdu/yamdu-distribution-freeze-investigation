const L=require('./lib');
(async()=>{const {p}=await L.conn();
L.log('N1 step3 PENDING open detail view');
await p.mouse.click(1212,506);await p.waitForTimeout(3500);await p.screenshot({path:L.EV+'/04-detail.png'});
L.log('N1 step3 DONE url '+p.url());process.exit(0)})().catch(e=>{console.log('ERR',e.message);process.exit(1)});
