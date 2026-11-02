const {conn,log,EV}=require('./lib');
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const {b,p}=await conn();p.setDefaultTimeout(8000);
await p.getByText('G2 test c1793423705314').first().click();await p.waitForTimeout(5000);
log('modal='+await p.getByText('Mail details').count());
await p.screenshot({path:EV+'/d4a.png'});
await p.getByText(/^Recipients \(\d+\)/).count().then(n=>log('recip tab count '+n));
const pr=async(l)=>{const t=Date.now();const r=await Promise.race([p.evaluate(()=>document.querySelectorAll('*').length),sleep(10000).then(()=>'TIMEOUT')]);log(l+' probe='+(Date.now()-t)+'ms '+r);if(r==='TIMEOUT'){await p.screenshot({path:EV+'/CAND.png',timeout:5000}).catch(()=>{});process.exit(2)}};
await pr('after reopen');
await p.mouse.click(940,500);await p.keyboard.press('End');
for(let i=1;i<=3;i++){log('Enter#'+i+' PENDING');await p.keyboard.type('Dear Andreas,',{delay:40});await p.keyboard.press('Enter');await pr('after Enter#'+i);}
await p.screenshot({path:EV+'/d4b.png'});
process.exit(0)})().catch(e=>{console.log('ERR',e.message.slice(0,300));process.exit(1)});
