const L=require('./lib');
(async()=>{const {p}=await L.conn();
L.log('O1 step10 PENDING nav Crew>External contacts, kebab of FRZ');
await p.waitForTimeout(2500);
await p.mouse.click(75,252);await p.waitForTimeout(3500);
await p.getByText('External contacts').first().click({timeout:8000});await p.waitForTimeout(3500);
await p.mouse.click(1298,464);await p.waitForTimeout(1200);await p.screenshot({path:L.EV+'/14-delmenu.png'});
L.log('O1 step10 DONE');process.exit(0)})().catch(e=>{console.log('ERR',e.message.slice(0,200));process.exit(1)});
