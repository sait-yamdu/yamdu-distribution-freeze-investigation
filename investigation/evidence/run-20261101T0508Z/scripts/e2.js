const L=require('./lib');
(async()=>{const {p}=await L.conn();
await p.getByText('External contacts',{exact:true}).first().click();await p.waitForTimeout(4000);
L.log('url '+p.url());await p.screenshot({path:L.EV+'/03-extcontacts.png'});
process.exit(0)})().catch(e=>{console.log('ERR',e.message);process.exit(1)});
