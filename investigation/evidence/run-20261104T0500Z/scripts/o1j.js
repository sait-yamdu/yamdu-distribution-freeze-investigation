const L=require('./lib');
(async()=>{const {p}=await L.conn();
L.log('O1 step9b PENDING Save as draft, go to ext contacts, open kebab of FRZ');
await p.mouse.click(737,224);await p.waitForTimeout(5000);
await p.getByText('Crew',{exact:true}).first().click({timeout:8000});await p.waitForTimeout(3500);
await p.getByText('External contacts').first().click();await p.waitForTimeout(3500);
const row=p.locator('div',{hasText:/^FRZ-Ext-1104 Probe/}).last();
await p.mouse.click(1298,464);await p.waitForTimeout(1200);await p.screenshot({path:L.EV+'/13-delmenu.png'});
L.log('O1 step9b DONE');process.exit(0)})().catch(e=>{console.log('ERR',e.message.slice(0,200));process.exit(1)});
