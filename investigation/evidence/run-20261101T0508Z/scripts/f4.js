const L=require('./lib');
(async()=>{const {p}=await L.conn();
L.log('PENDING select 3 files');
for(const [x,y] of [[770,375],[1022,375],[770,625]]){await p.mouse.click(x,y);await p.waitForTimeout(500)}
await p.screenshot({path:L.EV+'/14-sel.png'});
const b=await p.$$eval('button,[role=button]',e=>e.filter(x=>x.offsetParent).map(x=>x.innerText.trim().replace(/\n/g,' ')).filter(Boolean));L.log(JSON.stringify(b));
process.exit(0)})().catch(e=>{console.log('ERR',e.message);process.exit(1)});
