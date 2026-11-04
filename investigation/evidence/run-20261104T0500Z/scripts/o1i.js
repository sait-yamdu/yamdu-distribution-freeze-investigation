const L=require('./lib');
(async()=>{const {p}=await L.conn();
L.log('O1 step9 PENDING close modal + delete contact');
await p.mouse.click(1288,36);await p.waitForTimeout(1500);
await p.getByText('Discard changes').first().click().catch(e=>L.log('nodiscard'));await p.waitForTimeout(2000);
await p.getByText('Crew',{exact:true}).first().click();await p.waitForTimeout(3500);
await p.getByText('External contacts').first().click();await p.waitForTimeout(3500);
await p.mouse.click(1298,464);await p.waitForTimeout(1200);await p.screenshot({path:L.EV+'/13-delmenu.png'});
L.log('O1 step9 DONE');process.exit(0)})().catch(e=>{console.log('ERR',e.message);process.exit(1)});
