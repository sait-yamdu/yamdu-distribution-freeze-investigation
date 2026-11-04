const L=require('./lib');
(async()=>{const {p}=await L.conn();
L.log('O1 step1 PENDING Crew>External contacts>Add');
await p.getByText('Crew',{exact:true}).first().click();await p.waitForTimeout(4000);
await p.getByText('External contacts').first().click();await p.waitForTimeout(4000);
await p.screenshot({path:L.EV+'/03-ext.png'});
await p.getByRole('button',{name:/^Add/}).first().click().catch(e=>L.log('noadd '+e.message.slice(0,80)));await p.waitForTimeout(1500);
await p.screenshot({path:L.EV+'/04-add.png'});
L.log('O1 step1 DONE url '+p.url());process.exit(0)})().catch(e=>{console.log('ERR',e.message);process.exit(1)});
