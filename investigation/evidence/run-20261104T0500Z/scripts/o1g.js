const L=require('./lib');
(async()=>{const {p}=await L.conn();
L.log('O1 step7 PENDING Share files, search FRZ-Ext-1104');
await p.getByText('Share files',{exact:true}).first().click();await p.waitForTimeout(4000);
await p.screenshot({path:L.EV+'/10-share.png'});
L.log('O1 step7 DONE');process.exit(0)})().catch(e=>{console.log('ERR',e.message);process.exit(1)});
