// R11: regression on new bundle WmM9.. : CF1-like (14 recipients, ext email, 'Meine Lieben,' Enter) then unknown-route (R3/C3 original) + draft reopen + Enter
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
 log({ev:'start',note:'R12 repeated unknown route; R11 new bundle regression; one tab since login 05:17Z'});
 await probe('start');
 // --- R12: repeated unknown-route visits (accumulation), then draft reopen + Enter
 await step('nav-Distribution',()=>side('Distribution'));
 for(let i=1;i<=15;i++){
  await step('unknown-route-'+i,async()=>{const pre=await p.evaluate(()=>({sc:document.scripts.length,ls:(window.__ls||0)}));await p.evaluate(()=>{location.hash='#5551/scenes'});await sleep(4500);return {pre,hash:await p.evaluate(()=>location.hash),scripts:await p.evaluate(()=>document.scripts.length)}});
  await probe('unk-'+i);
  await step('nav-ok-'+i,()=>side(['Files & Documents','Distribution','Crew','Distribution'][i%4]));
  await probe('nav-'+i);
 }
 await step('nav-Distribution-final',()=>side('Distribution'));
 await step('open-draft',async()=>{await p.getByText(/^Draft/).first().click();await sleep(2500);await p.locator('tbody tr').first().click({timeout:6000});await sleep(3500);return await p.locator('.ProseMirror').count()});
 await probe('draft-reopened');
 for(let i=1;i<=3;i++){
  await step('enter-'+i,async()=>{await p.locator('.ProseMirror').first().click({timeout:5000});await p.keyboard.press('Control+End');await p.keyboard.press('Enter');await p.keyboard.type('Meine Lieben, r12 '+i,{delay:50});await p.keyboard.press('Enter');await sleep(500)});
  for(let k=1;k<=4;k++){await sleep(1000);await probe('enter-'+i+'-+'+k+'s')}
 }
 await p.screenshot({path:EV+'/05-end.png'});
 await step('save-close',async()=>{await p.getByRole('button',{name:/save.*draft/i}).click({timeout:5000});await sleep(2500);await closeAll()});
 log({ev:'end'});process.exit(0);
})().catch(e=>{log({ev:'fatal',err:e.message.slice(0,300)});process.exit(1)});
