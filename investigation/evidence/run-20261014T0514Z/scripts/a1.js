const {conn,log,EV,sleep}=require('./lib.js');
const fs=require('fs'),http=require('http');
const T0=Date.now(); const BUDGET=(+process.env.MIN||65)*60000;
let p,b;
const jget=(path)=>new Promise((res,rej)=>http.request({host:'localhost',port:9222,path,method:'PUT'},r=>{let d='';r.on('data',c=>d+=c);r.on('end',()=>res(d));}).on('error',rej).end());
async function probe(tag){ const s=Date.now();
  const r=await Promise.race([p.evaluate(()=>({hbmax:window.__hb&&Math.round(window.__hb.max),ed:document.querySelectorAll('.ProseMirror').length,nodes:document.getElementsByTagName('*').length,vis:document.visibilityState,heap:performance.memory&&Math.round(performance.memory.usedJSHeapSize/1e6),url:location.hash})),sleep(10000).then(()=>'TIMEOUT')]);
  log({ev:'probe',tag,dt:Date.now()-s,r}); if(r==='TIMEOUT'){ log({ev:'CANDIDATE_FREEZE',tag}); try{await Promise.race([p.screenshot({path:EV+'/CANDIDATE.png'}),sleep(8000)]);}catch(e){} fs.writeFileSync(EV+'/CANDIDATE.txt','candidate '+new Date().toISOString()+' '+tag); process.exit(3);} return r; }
async function step(name,fn,to=30000){ log({ev:'pending',name}); const s=Date.now();
  try{ const r=await Promise.race([fn(),sleep(to).then(()=>{throw new Error('step>'+to)})]); log({ev:'done',name,dt:Date.now()-s,r}); return r;}
  catch(e){ log({ev:'error',name,dt:Date.now()-s,err:e.message.slice(0,200)}); await probe('after-err-'+name); } }
async function closeAll(){ for(let i=0;i<4;i++){ await p.keyboard.press('Escape'); await sleep(400); const cancel=p.getByRole('button',{name:'Cancel',exact:true}); if(await cancel.count()){ try{await cancel.last().click({timeout:2000});}catch(e){} await sleep(700);} const conf=p.getByRole('button',{name:/^(Discard|Leave|Yes|Close without saving|Confirm)/i}); if(await conf.count()){ try{await conf.first().click({timeout:2000});}catch(e){} await sleep(700);} if(!(await p.locator('.ProseMirror').count())) return true; } return !(await p.locator('.ProseMirror').count()); }
const navSide=async(t)=>{ await p.locator('a:visible',{hasText:t}).first().click({timeout:8000}); await sleep(2500); log({ev:'nav',to:t,url:p.url()}); };
async function attach(){ ({b,p}=await conn()); p.on('dialog',d=>{log({ev:'dialog',msg:d.message().slice(0,100)});d.dismiss().catch(()=>{});}); p.on('pageerror',e=>log({ev:'pageerror',m:e.message.slice(0,150)})); p.on('crash',()=>log({ev:'CRASH'})); p.on('response',r=>{ if(r.status()>=400) log({ev:'http',s:r.status(),u:r.url().slice(0,100)}); });
  await p.evaluate(()=>{ if(window.__hb)return; const h=window.__hb={max:0}; let l=performance.now(); setInterval(()=>{const n=performance.now();const d=n-l-100;if(d>h.max)h.max=d;l=n;},100);}); }
async function hidePhase(sec){ // real hide: disconnect Playwright, open raw CDP tab, activate it, reactivate original
  const list=JSON.parse(await jget('/json')); const orig=list.find(t=>t.type==='page'&&t.url.includes('scotty'));
  await b.close(); await sleep(500);
  const nt=JSON.parse(await jget('/json/new?about:blank')); await jget('/json/activate/'+nt.id); await sleep(sec*1000);
  await jget('/json/activate/'+orig.id); await sleep(800); await jget('/json/close/'+nt.id); await sleep(800);
  await attach(); return await p.evaluate(()=>document.visibilityState); }



async function openNewestDraft(){
  await step('nav-distribution',()=>navSide('Distribution'));
  await step('open-draft',async()=>{ await p.getByText(/^Draft/).first().click(); await sleep(2500); await p.locator('tbody tr').first().click({timeout:6000}); await sleep(3500); return await p.locator('.ProseMirror').count(); });
}
async function burst(c){
  await openNewestDraft(); await probe('c'+c+'-draft-open');
  await step('check-recipients',async()=>{ await p.getByRole('button',{name:/^Check recipients/}).click({timeout:5000}); await sleep(2500); });
  await step('recipients-add',async()=>{
     await p.getByText(/^Recipients \(\d+\)/).first().click({timeout:5000}); await sleep(900);
     await p.getByText('Add new e-mail address').first().click({timeout:5000}); await sleep(600);
     await p.getByPlaceholder('Enter new email address').click({timeout:5000}); await p.keyboard.type('a1-c'+c+'-'+(Date.now()%100000)+'@example.com',{delay:40}); await sleep(300);
     await p.getByRole('button',{name:'Add',exact:true}).last().click({timeout:5000}); await sleep(1500);
     return await p.evaluate(()=>(document.body.innerText.match(/Recipients \((\d+)\)/)||[])[1]); },45000);
  await probe('c'+c+'-recip');
}
async function typeEnter(c,tag){ await step('enter-'+tag,async()=>{ const e=p.locator('.ProseMirror'); const n=await e.count(); if(n){ await e.first().click(); await p.keyboard.press('Control+End'); await p.keyboard.press('Enter'); await p.keyboard.type('Dear Andreas, a1 '+tag+' c'+c,{delay:50}); await p.keyboard.press('Enter'); await sleep(500);} return n; }); await probe('c'+c+'-'+tag+'-entered'); }
async function saveClose(c){ await step('save-draft',async()=>{ await p.getByRole('button',{name:/^Save draft/}).click({timeout:5000}); await sleep(3000); }); await probe('c'+c+'-saved'); await step('close',()=>closeAll()); }
async function idle(c,kind,min){
  const t0=Date.now(); log({ev:'idle-start',c,kind,min});
  if(kind==='visible'){ while(Date.now()-t0<min*60000){ await sleep(60000); await probe('c'+c+'-idle-vis'); } }
  else if(kind==='hidden'){ const v=await hidePhase(min*60); log({ev:'hide-phase',c,sec:min*60,visAfter:v,vl:await p.evaluate(()=>window.__vl)}); }
  else { await sleep(min*60000); }
  log({ev:'idle-end',c,kind,actualSec:Math.round((Date.now()-t0)/1000)});
  await probe('c'+c+'-after-idle-'+kind);
}
const KINDS=[['visible',8],['hidden',8],['hidden',10],['visible',8],['hidden',8],['visible',8]];
(async()=>{
 await attach();
 await p.evaluate(()=>{ if(window.__vl) return; window.__vl=[]; document.addEventListener('visibilitychange',()=>window.__vl.push([Math.round(performance.now()),document.visibilityState])); });
 log({ev:'start',note:'A1 aged session with idle: same tab since login 05:15Z; no reload',ua:await p.evaluate(()=>navigator.userAgent)});
 await step('close-all',()=>closeAll());
 let c=0;
 while(Date.now()-T0<BUDGET){ c++; const [kind,min]=KINDS[(c-1)%KINDS.length]; log({ev:'cycle',c,kind,min});
  await step('close-pre',()=>closeAll());
  await burst(c);
  await typeEnter(c,'pre');
  await idle(c,kind,min);
  await typeEnter(c,'post');
  await saveClose(c);
  for(const h of [['Crew','Files & Documents','Tasks'][c%3],['Scenes','Dashboard'][c%2]]) await step('nav-'+h,()=>navSide(h));
  await probe('c'+c+'-nav');
  if(Date.now()-T0>BUDGET-3*60000) break;
 }
 log({ev:'end',cycles:c}); await probe('end'); process.exit(0);
})().catch(e=>{log({ev:'fatal',err:e.message.slice(0,300)});process.exit(1)});
