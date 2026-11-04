const L=require('./lib');
(async()=>{const {p}=await L.conn();
L.log('SESSION RESET: chrome relaunched directly (no Playwright launcher), full load ~05:19Z; url '+p.url());
await p.waitForTimeout(3000);await p.screenshot({path:L.EV+'/19.png'});
L.log('PENDING Files&Documents');await p.mouse.click(120,336);await p.waitForTimeout(4000);
await p.mouse.click(795,590);await p.waitForTimeout(3500);await p.mouse.click(385,400);await p.waitForTimeout(4000);
await p.getByText('Select multiple').first().click();await p.waitForTimeout(1500);
for(const [x,y] of [[770,375],[1022,375],[770,625]]){await p.mouse.click(x,y);await p.waitForTimeout(500)}
await p.getByRole('button',{name:'Share files'}).click();await p.waitForTimeout(5000);
await p.evaluate(()=>{window.__vis=[];window.__v2=1;document.addEventListener('visibilitychange',()=>window.__vis.push([Date.now(),document.visibilityState]));window.__hbmax=0;let l=performance.now();setInterval(()=>{const n=performance.now();window.__hbmax=Math.max(window.__hbmax,n-l);l=n},250)});
L.log('modal open; PENDING search+select ext contact');
await p.mouse.click(180,179);await p.keyboard.type('FRZ-Ext-1101',{delay:80});await p.waitForTimeout(2500);
await p.mouse.click(271,303);await p.waitForTimeout(1000);await p.mouse.click(296,178);await p.waitForTimeout(1500);
await p.getByText(/^Recipients \(\d+\)/).first().click();await p.waitForTimeout(1000);
await p.mouse.click(940,318);await p.keyboard.type('FRZ ext contact share test',{delay:40});
await p.mouse.click(940,520);await p.keyboard.type('Dear Andreas,',{delay:60});await p.keyboard.press('Enter');await p.keyboard.type('Test text',{delay:60});await p.keyboard.press('Enter');
await p.screenshot({path:L.EV+'/20-reflow.png'});
L.log('COMPLETED modal state: '+await p.evaluate(()=>(document.body.innerText.match(/Recipients \(\d+\)/)||[''])[0]));
process.exit(0)})().catch(e=>{console.log('ERR',e.message);process.exit(1)});
