const L=require('./lib');
(async()=>{const {p}=await L.conn();
L.log('N1 step6b PENDING scroll up + close');
await p.mouse.move(930,400);await p.mouse.wheel(0,-3000);await p.waitForTimeout(800);
await p.mouse.click(1291,36);await p.waitForTimeout(3000);await p.screenshot({path:L.EV+'/08-close.png'});
L.log('N1 step6b DONE url '+p.url());process.exit(0)})().catch(e=>{console.log('ERR',e.message);process.exit(1)});
