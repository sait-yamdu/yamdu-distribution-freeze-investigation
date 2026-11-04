const L=require('./lib');const fs=require('fs');
const n=process.argv[2];
(async()=>{const {p}=await L.conn();
const probe=()=>Promise.race([p.evaluate(()=>new Promise(r=>{const s=performance.now();setTimeout(()=>r(Math.round(performance.now()-s)),0)})),new Promise(r=>setTimeout(()=>r('TIMEOUT'),10000))]);
const info=()=>p.evaluate(()=>({vis:window.__vis.map(x=>x[1]).join(','),hb:Math.round(window.__hbmax),nodes:document.getElementsByTagName('*').length,heapMB:Math.round((performance.memory||{usedJSHeapSize:0}).usedJSHeapSize/1048576),rc:(document.body.innerText.match(/Recipients \(\d+\)/)||[''])[0]}));
L.log(`c${n} AFTER-HIDDEN probe=${await probe()} ${JSON.stringify(await info())}`);
L.log(`c${n} PENDING Enter x2 + typing`);const T0=Date.now();
await p.mouse.click(930,520);await p.keyboard.press('Control+End');
for(const t of ['Meine Lieben,','Dear Andreas,']){await p.keyboard.press('Enter');await p.keyboard.type(t,{delay:40});await p.keyboard.press('Enter');}
const a=await probe();L.log(`c${n} COMPLETED Enter x4 probe=${a} elapsed=${Date.now()-T0}ms`);
L.log(`c${n} PENDING recipient change`);
await p.mouse.click(126,112);await p.waitForTimeout(800);await p.mouse.click(180,169);await p.keyboard.press('Control+A');await p.keyboard.type('Moritz',{delay:60});await p.waitForTimeout(1800);
await p.mouse.click(260,293);await p.waitForTimeout(800);
await p.mouse.click(180,169);await p.keyboard.press('Control+A');await p.keyboard.press('Backspace');await p.waitForTimeout(800);
await p.getByText(/^Recipients \(\d+\)/).first().click();await p.waitForTimeout(800);
const i2=await info();L.log(`c${n} COMPLETED recipient change probe=${await probe()} ${JSON.stringify(i2)}`);
await p.screenshot({path:L.EV+`/m1-c${n}.png`});
process.exit(0)})().catch(e=>{L.log(`c${n} ERR ${e.message.split('\n')[0]}`);process.exit(1)});
