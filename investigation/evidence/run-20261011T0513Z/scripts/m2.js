const {conn,log,EV,sleep}=require('./lib.js');
const fs=require('fs'),http=require('http');
const T0=Date.now(); const BUDGET=(+process.env.MIN||25)*60000;
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

async function openDraftToShare(c){
  await step('nav-distribution',()=>navSide('Distribution'));
  await step('open-draft',async()=>{ await p.getByText(/^Draft/).first().click(); await sleep(2500); await p.locator('tr:has-text("M1 explore")').first().click({timeout:6000}); await sleep(3500); return await p.locator('.ProseMirror').count(); });
  await probe('c'+c+'-draft-open');
  await step('check-recipients',async()=>{ await p.getByRole('button',{name:/^Check recipients/}).click({timeout:5000}); await sleep(2500); });
}
async function attachFiles(c,k){ await step('attach-files-'+k,async()=>{ await p.getByRole('button',{name:'Add file from project'}).click({timeout:6000}); await sleep(2000);
     await p.mouse.click(698,552); await sleep(1800); await p.mouse.click(696,200); await sleep(2500);
     for(const [x,y] of [[861,393],[1120,393],[602,610],[861,610]]){ await p.mouse.click(x,y); await sleep(250);}
     await p.getByRole('button',{name:/^Attach \d+ file/}).click({timeout:5000}); await sleep(2500); await p.evaluate(()=>{const bs=[...document.querySelectorAll('button')].filter(b=>b.offsetParent&&/^\s*Next\s*$/.test(b.innerText||'')).sort((a,b)=>b.getBoundingClientRect().y-a.getBoundingClientRect().y); if(!bs.length) throw new Error('no Next'); bs[0].click(); }); await sleep(3000); return await p.evaluate(()=>/Share files via/.test(document.body.innerText)); },60000); }
async function nextOnly(k){ await step('next-'+k,async()=>{ await p.evaluate(()=>{const bs=[...document.querySelectorAll('button')].filter(b=>b.offsetParent&&/^\s*Next\s*$/.test(b.innerText||'')).sort((a,b)=>b.getBoundingClientRect().y-a.getBoundingClientRect().y); if(!bs.length) throw new Error('no Next'); bs[0].click(); }); await sleep(3000); return await p.evaluate(()=>/Share files via/.test(document.body.innerText)); }); }
async function panelPlay(c,k){ await step('panel-play-'+k,async()=>{
   for(const t of ['Show company logo','Show subject','Show message','Show list of files','Show upload date']){ await p.getByText(t,{exact:true}).click({timeout:3000}); await sleep(250); await p.getByText(t,{exact:true}).click({timeout:3000}); await sleep(250); }
   const zip=p.locator('input[type=text]').filter({hasNot:p.locator('x')}).nth(0); 
   const zi=p.getByText('Zip Foldername').locator('xpath=following::input[1]'); await zi.click(); await p.keyboard.press('End'); await p.keyboard.type('_c'+c+k,{delay:50}); await p.keyboard.press('Enter');
   await p.getByText('Set expiration date',{exact:true}).click({timeout:3000}); await sleep(600); await p.getByText('Set expiration date',{exact:true}).click(); await sleep(400);
   await p.getByText('Password protection',{exact:true}).click({timeout:3000}); await sleep(700);
   const pw=p.locator('input[type=password],input[placeholder*=assword i]').first(); if(await pw.count()){ await pw.click(); await p.keyboard.type('Pw'+c+k,{delay:40}); await p.keyboard.press('Enter'); }
   await sleep(500); await p.getByText('Password protection',{exact:true}).click(); await sleep(400);
   const bg=p.getByText('Background color').locator('xpath=following::input[1]'); await bg.click(); await p.keyboard.press('Control+A'); await p.keyboard.type('#ff0'+(k%10)+'aa',{delay:40}); await p.keyboard.press('Enter'); await sleep(400);
   const rs=p.getByRole('button',{name:'Reset'}); if(await rs.count()){ await rs.first().click({timeout:3000}).catch(()=>{}); } await sleep(500);
   await p.screenshot({path:EV+'/m2-panel-c'+c+'-'+k+'.png'}); return 'ok'; },60000); }
async function back(k){ await step('back-'+k,async()=>{ await p.getByText('Back',{exact:true}).first().click({timeout:4000}); await sleep(2000); return await p.evaluate(()=>/Check recipients|Send now/.test(document.body.innerText)); }); }
async function changeRecipients(c,k){ await step('change-recipients-'+k,async()=>{ await p.getByText('Add new e-mail address').first().click({timeout:5000}); await sleep(600);
     await p.getByPlaceholder('Enter new email address').click(); await p.keyboard.type('m2-c'+c+k+'-'+(Date.now()%100000)+'@example.com',{delay:40}); await sleep(300);
     await p.getByRole('button',{name:'Add',exact:true}).last().click(); await sleep(1500);
     const s=p.getByPlaceholder('Name, email or position').first(); for(const q of ['test','a','']){ await s.fill(q); await sleep(700);} 
     return await p.evaluate(()=>(document.body.innerText.match(/(\d+) selected/)||[])[1]); }); }
(async()=>{
 await attach();
 log({ev:'start',note:'M2 share-files-via-email panel; same tab since login 05:15Z; no reload',ua:await p.evaluate(()=>navigator.userAgent)});
 await step('close-all',closeAll);
 let c=0;
 while(Date.now()-T0<BUDGET){ c++; log({ev:'cycle',c});
  await openDraftToShare(c);
  for(let k=1;k<=3;k++){
    if(k===1) await attachFiles(c,k); else await nextOnly(k); await probe('c'+c+'-k'+k+'-panel');
    await panelPlay(c,k); await probe('c'+c+'-k'+k+'-played');
    if(k===2 && c%2===0){ const v=await hidePhase(70); log({ev:'hide-phase',c,k,sec:70,visAfter:v}); await probe('c'+c+'-after-hide'); await panelPlay(c,k+'h'); await probe('c'+c+'-played-after-hide'); }
    await back(k); await probe('c'+c+'-k'+k+'-back');
    await changeRecipients(c,k); await probe('c'+c+'-k'+k+'-recip');
    await step('compose-enter',async()=>{ const e=p.locator('.ProseMirror'); if(await e.count()){ await e.first().click(); await p.keyboard.press('Control+End'); await p.keyboard.press('Enter'); await p.keyboard.type('Meine Lieben, c'+c+'-'+k,{delay:50}); await p.keyboard.press('Enter'); } return await e.count(); });
    await probe('c'+c+'-k'+k+'-typed');
  }
  await step('save-draft',async()=>{ await p.getByRole('button',{name:/^Save draft/}).click({timeout:5000}); await sleep(3000); });
  await probe('c'+c+'-saved'); await step('close',closeAll);
  for(const h of [['Crew','Files & Documents','Tasks'][c%3],['Scenes','Dashboard'][c%2]]) await step('nav-'+h,()=>navSide(h));
  await probe('c'+c+'-nav');
 }
 log({ev:'end',cycles:c}); await probe('end'); process.exit(0);
})().catch(e=>{log({ev:'fatal',err:e.message.slice(0,300)});process.exit(1)});
