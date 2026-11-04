const L=require('./lib');
(async()=>{const {p}=await L.conn();
L.log('O1 step4 PENDING Create');
await p.mouse.click(800,70);await p.waitForTimeout(600);
const v=await p.inputValue('#externalcontact_email').catch(()=>'?');L.log('email field='+v);
await p.mouse.click(1040,745);await p.waitForTimeout(6000);
await p.screenshot({path:L.EV+'/07-created.png'});L.log('O1 step4 DONE url '+p.url());process.exit(0)})().catch(e=>{console.log('ERR',e.message);process.exit(1)});
