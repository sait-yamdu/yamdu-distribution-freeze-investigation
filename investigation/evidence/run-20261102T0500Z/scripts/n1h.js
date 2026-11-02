const L=require('./lib');
(async()=>{const {p}=await L.conn();
L.log('N1 step6c PENDING scrollTo top + close');
await p.evaluate(()=>{window.scrollTo(0,0);document.querySelectorAll('*').forEach(e=>{if(e.scrollTop>0)e.scrollTop=0})});await p.waitForTimeout(800);
await p.mouse.click(1291,36);await p.waitForTimeout(3000);await p.screenshot({path:L.EV+'/09-close.png'});
L.log('N1 step6c DONE');process.exit(0)})().catch(e=>{console.log('ERR',e.message);process.exit(1)});
