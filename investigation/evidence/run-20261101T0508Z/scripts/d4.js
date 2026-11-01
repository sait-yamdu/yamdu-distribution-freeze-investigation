const L=require('./lib');(async()=>{const {p}=await L.conn();
L.log('d PENDING reopen newest draft');await p.mouse.click(380,433);await p.waitForTimeout(5000);
await p.screenshot({path:L.EV+'/d4a.png'});
L.log('d reopened; modal='+await p.evaluate(()=>document.body.innerText.includes('Mail details')+' '+(document.body.innerText.match(/Recipients \(\d+\)/)||[''])[0]));
process.exit(0)})().catch(e=>{L.log('ERR '+e.message.split('\n')[0]);process.exit(1)})
