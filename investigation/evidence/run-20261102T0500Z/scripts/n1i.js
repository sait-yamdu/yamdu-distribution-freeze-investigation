const L=require('./lib');
(async()=>{const {p}=await L.conn();
L.log('N1 step7 PENDING save draft, go Crew>External contacts, delete contact');
await p.mouse.click(741,224);await p.waitForTimeout(5000);
await p.getByText('Crew',{exact:true}).first().click();await p.waitForTimeout(3500);
await p.getByText('External contacts').first().click();await p.waitForTimeout(3500);
await p.mouse.click(1305,464);await p.waitForTimeout(1200);await p.screenshot({path:L.EV+'/10-del-menu.png'});
L.log('N1 step7 DONE (menu open)');process.exit(0)})().catch(e=>{console.log('ERR',e.message);process.exit(1)});
