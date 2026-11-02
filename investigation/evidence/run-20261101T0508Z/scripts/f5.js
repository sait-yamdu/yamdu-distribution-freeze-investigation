const L=require('./lib');
(async()=>{const {p}=await L.conn();
L.log('PENDING click Share files (3 selected)');
await p.getByRole('button',{name:'Share files'}).click();await p.waitForTimeout(5000);
await p.screenshot({path:L.EV+'/15-share.png'});
process.exit(0)})().catch(e=>{console.log('ERR',e.message);process.exit(1)});
