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
 log({ev:'start',note:'R22 new two-step flow Back/Next recipient-change loop, tnZBHIn'});
 await step('goto-dist',async()=>{await side('Distribution')});
 await probe('start');
 await step('add',async()=>{await p.getByRole('button',{name:'Add',exact:true}).first().click({timeout:8000});await sleep(2500)});
 await step('tick',async()=>{const bx=p.locator('input[type=checkbox]');const n=await bx.count();let ok=0;for(let i=1;i<n&&ok<10;i++){try{await bx.nth(i).check({timeout:2000,force:true});ok++}catch(e){}await sleep(120)}return {n,ok}});
 await step('next0',async()=>{await p.getByRole('button',{name:'Next',exact:true}).last().click({timeout:6000});await sleep(2500);return await p.locator('.ProseMirror').count()});
 await step('subject',async()=>{await p.getByPlaceholder('Subject').last().fill('R22 two-step loop')});
 for(let c=1;c<=8;c++){
  await step('type-'+c,async()=>{await p.locator('.ProseMirror').first().click({timeout:5000});await p.keyboard.press('Control+End');await p.keyboard.press('Enter');await p.keyboard.type('Dear Andreas, r22 '+c+',',{delay:50});await p.keyboard.press('Enter');await p.keyboard.type('Zeile '+c,{delay:30});await p.keyboard.press('Enter');await sleep(400)});
  await probe('enter-'+c);
  await step('back-'+c,async()=>{await p.getByText('Back',{exact:true}).first().click({timeout:5000});await sleep(1800)});
  await step('addext-'+c,async()=>{await p.getByText(/^Recipients \(\d+\)/).first().click({timeout:5000});await sleep(700);await p.getByText('Add new e-mail address').first().click({timeout:5000});await sleep(500);await p.getByPlaceholder('Enter new email address').click({timeout:5000});await p.keyboard.type('r22-'+c+'-ext@example.com',{delay:30});await p.getByRole('button',{name:'Add',exact:true}).last().click({timeout:5000});await sleep(1000);return await p.evaluate(()=>(document.body.innerText.match(/Recipients \((\d+)\)/)||[])[1])});
  await step('search-'+c,async()=>{const s=p.getByPlaceholder('Name, email or position');await s.fill('test');await sleep(900);await s.fill('');await sleep(500)});
  await step('next-'+c,async()=>{await p.getByRole('button',{name:'Next',exact:true}).last().click({timeout:6000});await sleep(2000);return await p.locator('.ProseMirror').count()});
  await probe('cycle-'+c);
 }
 await p.screenshot({path:EV+'/22-end.png'});
 await step('discard',async()=>{await p.getByRole('button',{name:'Cancel',exact:true}).last().click({timeout:4000});await sleep(900);await p.getByRole('button',{name:'Discard changes'}).click({timeout:4000});await sleep(1000)});
 log({ev:'end'});process.exit(0);
})().catch(e=>{log({ev:'fatal',err:e.message.slice(0,300)});process.exit(1)});
