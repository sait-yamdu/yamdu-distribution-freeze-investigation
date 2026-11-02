const {conn,log,EV,sleep}=require('./lib.js');
const fs=require('fs'),http=require('http');
const T0=Date.now(); const BUDGET=(+process.env.MIN||25)*60000;
let p,b;
const jget=(path)=>new Promise((res,rej)=>http.get('http://localhost:9222'+path,r=>{let d='';r.on('data',c=>d+=c);r.on('end',()=>res(d));}).on('error',rej));
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
(async()=>{
 await attach();
 log({ev:'start',note:'same tab since login 05:15Z; no reload; M1 share-step state',ua:await p.evaluate(()=>navigator.userAgent)});
 await step('close-all',closeAll);
 let c=0;
 while(Date.now()-T0<BUDGET){ c++; log({ev:'cycle',c});
  await step('nav-distribution',()=>navSide('Distribution'));
  await step('open-draft',async()=>{ await p.getByText(/^Draft/).first().click(); await sleep(2500); await p.locator('tr:has-text("M1 explore")').first().click({timeout:6000}); await sleep(3500); return await p.locator('.ProseMirror').count(); });
  await probe('c'+c+'-draft-open');
  await step('check-recipients',async()=>{ await p.getByRole('button',{name:/^Check recipients/}).click({timeout:5000}); await sleep(2500); });
  await probe('c'+c+'-step2');
  await step('attach-files-step2',async()=>{ await p.getByRole('button',{name:'Add file from project'}).click({timeout:6000}); await sleep(2000);
     await p.mouse.click(698,552); await sleep(1800); await p.mouse.click(696,200); await sleep(2500);
     for(const [x,y] of [[602,176],[861,176],[1120,176],[602,393]]){ await p.mouse.click(x,y); await sleep(250);}
     await p.screenshot({path:EV+'/m1-pick-c'+c+'.png'});
     await p.getByRole('button',{name:/^Attach \d+ file/}).click({timeout:5000}); await sleep(2500); return 'attached'; },60000);
  await probe('c'+c+'-attached');
  await step('toggle-share-link-email',async()=>{ for(let i=0;i<2;i++){ await p.getByRole('button',{name:'Share via link'}).click({timeout:4000}); await sleep(900); await p.getByRole('button',{name:'Share via email'}).click({timeout:4000}); await sleep(900);} });
  await probe('c'+c+'-toggled');
  await step('change-recipients',async()=>{ // uncheck first, add external, recheck via search
     const cbs=p.locator('input[type=checkbox]'); const n=await cbs.count();
     await p.getByText('Add new e-mail address').first().click({timeout:5000}); await sleep(600);
     await p.getByPlaceholder('Enter new email address').click(); await p.keyboard.type('m1-c'+c+'-'+(Date.now()%100000)+'@example.com',{delay:40}); await sleep(300);
     await p.getByRole('button',{name:'Add',exact:true}).last().click(); await sleep(1500);
     return n; });
  await probe('c'+c+'-recip-changed');
  await step('more-sending-options',async()=>{ const arrow=p.locator('button:has(svg)').filter({has:p.locator('xpath=self::*')}).last(); await p.mouse.click(1314,712); await sleep(1200); await p.screenshot({path:EV+'/m1-more-c'+c+'.png'}); const t=await p.evaluate(()=>document.body.innerText.match(/(Schedule|Send later|Send at)[^\n]*/i)?.[0]); await p.getByText('Send at a scheduled time').click({timeout:3000}); await sleep(1500); await p.screenshot({path:EV+'/m1-sched-c'+c+'.png'}); await p.keyboard.press('Escape'); await sleep(600); return t; });
  await probe('c'+c+'-more-opts');
  await step('editor-enter-in-step2',async()=>{ await p.locator('.ProseMirror').first().click(); await p.keyboard.press('Control+End'); await p.keyboard.press('Enter'); await p.keyboard.type('Meine Lieben, c'+c,{delay:50}); await p.keyboard.press('Enter'); await p.keyboard.type('Dear Andreas,',{delay:50}); await p.keyboard.press('Enter'); });
  await probe('c'+c+'-typed');
  if(c%2===0){ const v=await hidePhase(70); log({ev:'hide-phase',c,sec:70,visAfter:v}); await probe('c'+c+'-after-hide');
    await step('type-after-hide',async()=>{ await p.locator('.ProseMirror').first().click(); await p.keyboard.press('Control+End'); await p.keyboard.press('Enter'); await p.keyboard.type('back from hidden',{delay:50}); await p.keyboard.press('Enter'); }); await probe('c'+c+'-typed-after-hide'); }
  else await step('idle-45s',async()=>{ await sleep(45000); },60000);
  await step('save-draft',async()=>{ await p.getByRole('button',{name:/^Save draft/}).click({timeout:5000}); await sleep(3000); await p.screenshot({path:EV+'/m1-saved-c'+c+'.png'}); });
  await probe('c'+c+'-saved');
  await step('close',closeAll);
  for(const h of [['Crew','Files & Documents','Tasks'][c%3],['Scenes','Dashboard'][c%2]]) await step('nav-'+h,()=>navSide(h));
  await probe('c'+c+'-nav');
 }
 log({ev:'end',cycles:c}); await probe('end'); process.exit(0);
})().catch(e=>{log({ev:'fatal',err:e.message.slice(0,300)});process.exit(1)});
