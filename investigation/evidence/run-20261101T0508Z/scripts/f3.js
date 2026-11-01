const L=require('./lib');
(async()=>{const {p}=await L.conn();
L.log('PENDING open document card');await p.mouse.click(385,400);await p.waitForTimeout(4000);
await p.getByText('Select multiple',{exact:false}).first().click();await p.waitForTimeout(1500);
await p.screenshot({path:L.EV+'/13-doc.png'});
process.exit(0)})().catch(e=>{console.log('ERR',e.message);process.exit(1)});
