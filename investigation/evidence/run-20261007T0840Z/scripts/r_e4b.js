const {chromium}=require('playwright');
const fs=require('fs');
const LOG=process.env.LOG;
const EV=process.env.EV;
const T0=Date.now(); const BUDGET=(+process.env.MIN||45)*60000;
const log=(o)=>fs.appendFileSync(LOG,JSON.stringify({t:new Date().toISOString(),el_s:Math.round((Date.now()-T0)/1000),...o})+'\n');
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let p;
async function probe(tag){ // bounded liveness probe
  const s=Date.now();
  const r=await Promise.race([p.evaluate(()=>({hb:window.__hb&&{max:window.__hb.max,n:window.__hb.n,lt:window.__hb.lt.length,ltmax:Math.max(0,...window.__hb.lt)},ed:document.querySelectorAll('.ProseMirror').length,vis:document.visibilityState,heap:performance.memory&&Math.round(performance.memory.usedJSHeapSize/1e6),nodes:document.getElementsByTagName('*').length})),sleep(10000).then(()=>'TIMEOUT')]);
  const dt=Date.now()-s;
  log({ev:'probe',tag,dt,r});
  if(r==='TIMEOUT'){ await candidate(tag); }
  return r;
}
async function candidate(tag){
  log({ev:'CANDIDATE_FREEZE',tag,note:'evaluate >10s'});
  try{ await Promise.race([p.screenshot({path:EV+'candidate.png'}),sleep(8000)]);}catch(e){}
  fs.writeFileSync(EV+'CANDIDATE.txt','candidate at '+new Date().toISOString()+' tag '+tag);
  process.exit(3);
}
async function step(name,fn,to=25000){
  log({ev:'pending',name});
  const s=Date.now();
  try{ const r=await Promise.race([fn(),sleep(to).then(()=>{throw new Error('step>'+to)})]); log({ev:'done',name,dt:Date.now()-s,r}); }
  catch(e){ log({ev:'error',name,dt:Date.now()-s,err:e.message.slice(0,200)}); await probe('after-error-'+name); }
}
const HASHES=['crew','files','cast','scenes','dashboard'];
(async()=>{
 const b=await chromium.connectOverCDP('http://localhost:9222');
 p=b.contexts()[0].pages()[0];
 p.on('dialog',d=>{log({ev:'dialog',type:d.type(),msg:d.message().slice(0,100)});d.dismiss().catch(()=>{});});
 p.on('pageerror',e=>log({ev:'pageerror',m:e.message.slice(0,150)}));
 p.on('crash',()=>log({ev:'CRASH'}));
 await p.evaluate(()=>{ const h=window.__hb={max:0,n:0,lt:[]}; let l=performance.now(); setInterval(()=>{const n=performance.now();const d=n-l-100;if(d>h.max)h.max=d;h.n++;l=n;},100); try{new PerformanceObserver(l=>l.getEntries().forEach(e=>h.lt.push(Math.round(e.duration)))).observe({entryTypes:['longtask']});}catch(e){} });
 log({ev:'start',url:p.url(),ua:await p.evaluate(()=>navigator.userAgent),note:'same tab since login; no reload during E4'});
 await probe('start');
 // reset UI to known state: close modal if open
 await step('close-initial-modal',async()=>{ await p.keyboard.press('Escape'); await p.mouse.click(1315,37); await sleep(800); return await p.evaluate(()=>!!document.querySelector('.ProseMirror')); });
 let c=0;
 while(Date.now()-T0<BUDGET){
  c++; log({ev:'cycle',c});
  // go to distribution
  await step('nav-distribution',async()=>{ await p.evaluate(()=>{location.hash='#5551/announcements:files:filedistribution'}); await sleep(2500); });
  await probe('c'+c+'-dist');
  await step('open-add-modal',async()=>{ await p.getByRole('button',{name:'Add',exact:true}).first().click({timeout:8000}); await sleep(2000); });
  await step('select-recipients',async()=>{
    const boxes=p.locator('input[type=checkbox]'); const n=await boxes.count(); const k=Math.min(n-1,5+(c*3)%10); let ok=0;
    for(let i=1;i<=k;i++){ try{ await boxes.nth(i).check({timeout:3000,force:true}); ok++; }catch(e){} await sleep(150); }
    return {total:n,checked:ok};
  });
  await probe('c'+c+'-recips');
  if(c%2===1) await step('external-email-entry',async()=>{
    await p.mouse.click(860,228);
    await p.keyboard.type('freeze-probe-'+c+'@example.com',{delay:40}); await sleep(600); await p.keyboard.press('Enter'); await sleep(1200);
    await p.screenshot({path:EV+'ext-c'+c+'.png'});
    return await p.evaluate(()=>document.body.innerText.includes('freeze-probe'));
  });
  await step('subject',async()=>{ await p.getByPlaceholder('Subject').last().fill('Freeze probe E4 cycle '+c); });
  await step('type-greeting-enter',async()=>{
    const ed=p.locator('.ProseMirror').first(); await ed.click({timeout:5000});
    await p.keyboard.type(['Dear Andreas,','Meine Lieben,','Hello team,'][c%3],{delay:60}); await p.keyboard.press('Enter');
    await p.keyboard.type('Please find the files attached. Line '+c,{delay:40}); await p.keyboard.press('Enter'); await p.keyboard.press('Enter');
    await p.keyboard.type('Best regards',{delay:40}); await sleep(500);
  });
  await probe('c'+c+'-typed');
  if(c%2===0) await step('add-file-from-project',async()=>{ await p.getByRole('button',{name:'Add file from project'}).click({timeout:5000}); await sleep(2500); await p.screenshot({path:EV+'files-c'+c+'.png'}); const cb=p.locator('[role=dialog] input[type=checkbox], .modal input[type=checkbox]'); const n=await cb.count(); let ok=0; for(let i=0;i<Math.min(n,6);i++){try{await cb.nth(i).check({timeout:2000,force:true});ok++}catch(e){} await sleep(200);} return {n,ok}; });
  await probe('c'+c+'-files');
  await step('idle-with-modal',async()=>{ await sleep(30000); },60000);
  await probe('c'+c+'-idle');
  if(c%3===0) await step('check-recipients',async()=>{ await p.getByRole('button',{name:'Check recipients'}).click({timeout:5000}); await sleep(3500); });
  await step('save-draft',async()=>{ await p.getByRole('button',{name:'Save as draft'}).click({timeout:5000}); await sleep(3000); await p.screenshot({path:EV+'draft-c'+c+'.png'}); return await p.evaluate(()=>!!document.querySelector('.ProseMirror')); });
  await probe('c'+c+'-saved');
  // leave modal if still open
  await step('close-modal',async()=>{ const x=p.getByRole('button',{name:/cancel/i}).first(); if(await x.count()) await x.click({timeout:3000}).catch(()=>{}); await sleep(800); await p.keyboard.press('Escape'); await sleep(500); return await p.evaluate(()=>document.querySelectorAll('.ProseMirror').length); });
  // mixed navigation
  for(const h of [HASHES[c%5],HASHES[(c+2)%5]]) await step('nav-'+h,async()=>{ await p.evaluate(h=>{location.hash='#5551/'+h},h); await sleep(6000); });
  await probe('c'+c+'-nav');
  await step('nav-dist-drafts',async()=>{ await p.evaluate(()=>{location.hash='#5551/announcements:files:filedistribution'}); await sleep(3000); const d=p.getByText(/^Draft/).first(); await d.click({timeout:5000}); await sleep(2500); await p.screenshot({path:EV+'drafts-c'+c+'.png'}); });
  await step('reopen-draft',async()=>{ const rows=p.locator('tr:has-text("Freeze probe E4")'); const rc=await rows.count(); const rtxt=(await rows.first().innerText().catch(()=>'')).replace(/\s+/g,' ').slice(0,160); log({ev:'draft-row',count:rc,first:rtxt}); const row=rows.first(); await row.click({timeout:5000}); await sleep(3500); const ed=await p.locator('.ProseMirror').count(); if(ed){ await p.locator('.ProseMirror').first().click(); await p.keyboard.press('End'); await p.keyboard.press('Enter'); await p.keyboard.type('reopened '+c,{delay:50}); await sleep(1000);} return {ed}; });
  await probe('c'+c+'-reopened');
  await step('idle-with-reopened',async()=>{ await sleep(20000); },40000);
  await step('close-reopened',async()=>{ await p.keyboard.press('Escape'); await p.mouse.click(1315,37); await sleep(1200); await p.keyboard.press('Escape'); });
 }
 log({ev:'end',cycles:c});
 await probe('end');
 process.exit(0);
})().catch(e=>{log({ev:'fatal',err:e.message.slice(0,300)});process.exit(1)});
