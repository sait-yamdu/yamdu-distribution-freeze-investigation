const L=require('./lib');
(async()=>{const {p}=await L.conn();
L.log('O1 step3 PENDING pick position, email, save');
await p.mouse.click(386,474);await p.waitForTimeout(800);
await p.fill('#externalcontact_email','frz1104@example.com');
await p.screenshot({path:L.EV+'/06-form2.png'});
L.log('O1 step3 DONE');process.exit(0)})().catch(e=>{console.log('ERR',e.message);process.exit(1)});
