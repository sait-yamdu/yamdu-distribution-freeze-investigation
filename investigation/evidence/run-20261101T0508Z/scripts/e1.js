const L=require('./lib');
(async()=>{const {p}=await L.conn();
await p.getByText('Crew',{exact:true}).first().click();await p.waitForTimeout(5000);
L.log('url '+p.url());await p.screenshot({path:L.EV+'/02-crew.png'});
const btns=await p.$$eval('button, a[role=button], [role=tab]',e=>e.map(x=>x.innerText.trim()).filter(Boolean).slice(0,40));L.log(JSON.stringify(btns));
process.exit(0)})().catch(e=>{console.log('ERR',e.message);process.exit(1)});
