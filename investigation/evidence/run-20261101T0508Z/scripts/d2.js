const L=require('./lib');(async()=>{const {p}=await L.conn();
L.log('d PENDING click Save as draft');await p.mouse.click(1097,769);await p.waitForTimeout(5000);
await p.screenshot({path:L.EV+'/d2a.png'});
L.log('d COMPLETED save; modal still open='+await p.evaluate(()=>document.body.innerText.includes('Mail details')));
process.exit(0)})().catch(e=>{L.log('ERR '+e.message.split('\n')[0]);process.exit(1)})
