// R11: regression on new bundle 38mlI.. : CF1-like (14 recipients, ext email, 'Meine Lieben,' Enter) then unknown-route (R3/C3 original) + draft reopen + Enter
const {conn,log,EV,sleep}=require('./lib.js');
const fs=require('fs');
let p,b;
async function probe(tag){const s=Date.now();
 const r=await Promise.race([p.evaluate(()=>({scripts:document.scripts.length,ed:document.querySelectorAll('.ProseMirror').length,nodes:document.getElementsByTagName('*').length,vis:document.visibilityState,heap:performance.memory&&Math.round(performance.memory.usedJSHeapSize/1e6),hash:location.hash})),sleep(10000).then(()=>'TIMEOUT')]);
 log({ev:'probe',tag,dt:Date.now()-s,r});
 if(r==='TIMEOUT'){log({ev:'CANDIDATE_FREEZE',tag});try{await Promise.race([p.screenshot({path:EV+'/CANDIDATE.png'}),sleep(8000)])}catch(e){} fs.writeFileSync(EV+'/CANDIDATE.txt','candidate '+new Date().toISOString()+' '+tag);process.exit(3)} return r;}
async function step(name,fn,to=30000){log({ev:'pending',name});const s=Date.now();
 try{const r=await Promise.race([fn(),sleep(to).then(()=>{throw new Error('step>'+to)})]);log({ev:'done',name,dt:Date.now()-s,r});return r}catch(e){log({ev:'error',name,dt:Date.now()-s,err:e.message.slice(0,200)});await probe('after-err-'+name)}}
const side=async(t)=>{await p.locator('a:visible',{hasText:t}).first().click({timeout:8000});await sleep(2500);log({ev:'nav',to:t,url:p.url()})};
async function closeAll(){for(let i=0;i<3;i++){const c=p.getByRole('button',{name:'Cancel',exact:true});if(await c.count()){try{await c.last().click({timeout:2000})}catch(e){}await sleep(700)}}}
(async()=>{
 ({b,p}=await conn());
 p.on('dialog',d=>{log({ev:'dialog',msg:d.message().slice(0,100)});d.dismiss().catch(()=>{})});
 p.on('pageerror',e=>log({ev:'pageerror',m:e.message.slice(0,150)}));
 p.on('crash',()=>log({ev:'CRASH'}));
 p.on('response',r=>{if(r.status()>=400)log({ev:'http',s:r.status(),u:r.url().slice(0,100)})});
 p.on('console',m=>{if(m.type()==='error')log({ev:'console_error',t:m.text().slice(0,150)})});
 log({ev:'start',note:'R14 new bundle 38mlI regression'});
 await probe('start');
 // --- R11a: CF1-like
 await step('add',async()=>{await p.getByRole('button',{name:'Add',exact:true}).first().click({timeout:8000});await sleep(2500)});
 await p.screenshot({path:EV+'/01-add.png'});
 await step('tick-14',async()=>{const bx=p.locator('input[type=checkbox]');const n=await bx.count();let ok=0;for(let i=1;i<n&&ok<22;i++){try{await bx.nth(i).check({timeout:2000,force:true});ok++}catch(e){}await sleep(120)}return {n,ok}});
 await probe('ticked');
 await step('ext-email',async()=>{await p.getByText(/^Recipients \(\d+\)/).first().click({timeout:5000});await sleep(900);await p.getByText('Add new e-mail address').first().click({timeout:5000});await sleep(600);await p.getByPlaceholder('Enter new email address').click({timeout:5000});await p.keyboard.type('r11b-ext@example.com',{delay:40});await sleep(300);await p.getByRole('button',{name:'Add',exact:true}).last().click({timeout:5000});await sleep(1500);return await p.evaluate(()=>(document.body.innerText.match(/Recipients \((\d+)\)/)||[])[1])},45000);
 await p.screenshot({path:EV+'/02-recips.png'});
 await step('subject',async()=>{await p.getByPlaceholder('Subject').last().fill('R11 regress probe 2')});
 await step('type-meine-lieben',async()=>{await p.locator('.ProseMirror').first().click({timeout:5000});await p.keyboard.type('Meine Lieben,',{delay:70});await probe('before-enter-1');await p.keyboard.press('Enter');await p.keyboard.type('Bitte Dateien beachten.',{delay:40});await p.keyboard.press('Enter');await sleep(500)});
 await probe('after-enter-1');
 await p.screenshot({path:EV+'/03-composed.png'});
 await step('save-draft',async()=>{const sb=p.getByRole('button',{name:/save.*draft/i});await sb.scrollIntoViewIfNeeded().catch(()=>{});await sb.click({timeout:5000});await sleep(3000)});
 await step('close',()=>closeAll());
 await probe('saved');
 // --- R11b: original R3/C3 unknown-route step on new build
 const pre=await p.evaluate(()=>document.scripts.length);
 await step('hash-scenes',async()=>{await p.evaluate(()=>{location.hash='#5551/scenes'});await sleep(6000);return {hash:await p.evaluate(()=>location.hash),scripts:await p.evaluate(()=>document.scripts.length),pre}});
 await p.screenshot({path:EV+'/04-after-unknown-route.png'});
 await probe('after-unknown-route');
 await step('nav-Files',()=>side('Files & Documents'));
 await step('nav-Distribution',()=>side('Distribution'));
 await step('open-draft',async()=>{await p.getByText(/^Draft/).first().click();await sleep(2500);await p.locator('tbody tr').first().click({timeout:6000});await sleep(3500);return await p.locator('.ProseMirror').count()});
 await probe('draft-reopened');
 for(let i=1;i<=3;i++){
  await step('enter-'+i,async()=>{await p.locator('.ProseMirror').first().click({timeout:5000});await p.keyboard.press('Control+End');await p.keyboard.press('Enter');await p.keyboard.type('Dear Andreas, r11 '+i,{delay:50});await p.keyboard.press('Enter');await sleep(500)});
  for(let k=1;k<=4;k++){await sleep(1000);await probe('enter-'+i+'-+'+k+'s')}
 }
 await p.screenshot({path:EV+'/05-end.png'});
 await step('save-close',async()=>{await p.getByRole('button',{name:/save.*draft/i}).click({timeout:5000});await sleep(2500);await closeAll()});
 log({ev:'end'});process.exit(0);
})().catch(e=>{log({ev:'fatal',err:e.message.slice(0,300)});process.exit(1)});
