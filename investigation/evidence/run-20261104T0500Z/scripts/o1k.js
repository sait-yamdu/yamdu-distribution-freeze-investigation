const L=require('./lib');
(async()=>{const {p}=await L.conn();
L.log('O1 step9c PENDING subject, X, Save as draft');
await p.mouse.click(900,308);await p.keyboard.type('FRZ O1 deleted-contact draft',{delay:30});
await p.mouse.click(1288,36);await p.waitForTimeout(1500);
await p.mouse.click(737,224);await p.waitForTimeout(5000);
await p.screenshot({path:L.EV+'/13d.png'});L.log('O1 step9c DONE url '+p.url());process.exit(0)})().catch(e=>{console.log('ERR',e.message.slice(0,200));process.exit(1)});
