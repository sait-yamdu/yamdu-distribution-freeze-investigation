const L=require('./lib');
(async()=>{const {p}=await L.conn();
L.log('N1 step1 PENDING open Crew');
await p.getByText('Crew',{exact:true}).first().click();await p.waitForTimeout(4000);
await p.getByText('External contacts').first().click().catch(e=>L.log('noext '+e.message.slice(0,80)));await p.waitForTimeout(4000);
L.log('url '+p.url());await p.screenshot({path:L.EV+'/02-ext.png'});L.log('N1 step1 DONE');process.exit(0)})().catch(e=>{console.log('ERR',e.message);process.exit(1)});
