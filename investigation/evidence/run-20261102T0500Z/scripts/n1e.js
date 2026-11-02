const L=require('./lib');
(async()=>{const {p}=await L.conn();
L.log('N1 step5 PENDING Distribution > Draft');
await p.getByText('Distribution',{exact:true}).first().click();await p.waitForTimeout(4000);
await p.getByText('Draft (',{exact:false}).first().click();await p.waitForTimeout(3000);
await p.getByText('FRZ ext contact share test').first().click().catch(e=>L.log('nodraft '+e.message.slice(0,60)));await p.waitForTimeout(5000);
await p.screenshot({path:L.EV+'/06-draft.png'});L.log('N1 step5 DONE url '+p.url());process.exit(0)})().catch(e=>{console.log('ERR',e.message);process.exit(1)});
