const L=require('./lib');
(async()=>{const {p}=await L.conn();
L.log('O1 step8 PENDING search FRZ-Ext-1104, select, type message');
await p.mouse.click(150,168);await p.keyboard.type('FRZ-Ext',{delay:60});await p.waitForTimeout(2500);
await p.screenshot({path:L.EV+'/11-search.png'});
await p.mouse.click(256,293).catch(()=>{});await p.waitForTimeout(800);
const rc=await p.getByText(/Recipients \(\d+\)/).first().innerText();L.log('tab '+rc);
await p.mouse.click(900,520);
for(const w of ['Dear Andreas,','Meine Lieben,']){await p.keyboard.type(w,{delay:40});await p.keyboard.press('Enter');}
await p.screenshot({path:L.EV+'/12-typed.png'});
L.log('O1 step8 DONE');process.exit(0)})().catch(e=>{console.log('ERR',e.message);process.exit(1)});
