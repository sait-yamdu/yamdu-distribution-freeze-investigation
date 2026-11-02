const L=require('./lib');
(async()=>{const {p}=await L.conn();
await p.screenshot({path:L.EV+'/11a.png'});
L.log('PENDING click sidebar Files & Documents by coordinates');
await p.mouse.click(120,336);await p.waitForTimeout(4000);
await p.screenshot({path:L.EV+'/11-files.png'});L.log('url '+p.url());
process.exit(0)})().catch(e=>{console.log('ERR',e.message);process.exit(1)});
