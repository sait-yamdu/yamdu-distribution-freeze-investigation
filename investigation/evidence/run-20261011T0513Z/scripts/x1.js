const {conn,log,EV,sleep}=require('./lib.js');
const fs=require('fs'); const T0=Date.now(); const BUDGET=(+process.env.MIN||30)*60000;
let p;
async function probe(tag){ const s=Date.now();
  const r=await Promise.race([p.evaluate(()=>({hbmax:window.__hb&&Math.round(window.__hb.max),ed:document.querySelectorAll('.ProseMirror').length,nodes:document.getElementsByTagName('*').length,vis:document.visibilityState,heap:performance.memory&&Math.round(performance.memory.usedJSHeapSize/1e6),url:location.hash})),sleep(10000).then(()=>'TIMEOUT')]);
  log({ev:'probe',tag,dt:Date.now()-s,r}); if(r==='TIMEOUT'){ log({ev:'CANDIDATE_FREEZE',tag}); try{await Promise.race([p.screenshot({path:EV+'/CANDIDATE.png'}),sleep(8000)]);}catch(e){} fs.writeFileSync(EV+'/CANDIDATE.txt','candidate '+new Date().toISOString()+' '+tag); process.exit(3);} return r; }
async function guard(){ try{ if(await p.locator('text=Store current mailing list').count()){ await p.getByRole('button',{name:'Cancel'}).last().click({timeout:3000}); log({ev:'guard',did:'cancel store-mailing-list dialog'}); await sleep(500);} }catch(e){} }
async function step(name,fn,to=30000){ await guard(); log({ev:'pending',name}); const s=Date.now();
  try{ const r=await Promise.race([fn(),sleep(to).then(()=>{throw new Error('step>'+to)})]); log({ev:'done',name,dt:Date.now()-s,r}); return r;}
  catch(e){ log({ev:'error',name,dt:Date.now()-s,err:e.message.slice(0,200)}); await probe('after-err-'+name); } }
async function closeAll(){ for(let i=0;i<4;i++){ await p.keyboard.press('Escape'); await sleep(400); const cancel=p.getByRole('button',{name:'Cancel',exact:true}); if(await cancel.count()){ try{await cancel.last().click({timeout:2000});}catch(e){} await sleep(700);} const conf=p.getByRole('button',{name:/^(Discard|Leave|Yes|Close without saving|Confirm)/i}); if(await conf.count()){ try{await conf.first().click({timeout:2000});}catch(e){} await sleep(700);} if(!(await p.locator('.ProseMirror').count())) return true; } return !(await p.locator('.ProseMirror').count()); }
const navSide=async(t)=>{ await p.locator('a:visible',{hasText:t}).first().click({timeout:8000}); await sleep(2500); log({ev:'nav',to:t,url:p.url()}); };
(async()=>{
 ({p}=await conn());
 p.on('dialog',d=>{log({ev:'dialog',msg:d.message().slice(0,100)});d.dismiss().catch(()=>{});});
 p.on('pageerror',e=>log({ev:'pageerror',m:e.message.slice(0,150)}));
 p.on('crash',()=>log({ev:'CRASH'}));
 p.on('response',r=>{ if(r.status()>=400) log({ev:'http',s:r.status(),u:r.url().slice(0,100)}); });
 await p.evaluate(()=>{ if(window.__hb)return; const h=window.__hb={max:0}; let l=performance.now(); setInterval(()=>{const n=performance.now();const d=n-l-100;if(d>h.max)h.max=d;l=n;},100);});
 log({ev:'start',url:p.url(),note:'same tab since login 05:15Z; no reload',ua:await p.evaluate(()=>navigator.userAgent)});
 await step('close-open-modals',closeAll);
 let c=0;
 while(Date.now()-T0<BUDGET){ c++; log({ev:'cycle',c});
  await step('nav-distribution',()=>navSide('Distribution'));
  await step('add',async()=>{ await p.getByRole('button',{name:'Add',exact:true}).first().click({timeout:8000}); await sleep(2000); });
  await step('recipients-tab-add-external',async()=>{ await p.getByText(/^Recipients \(/).first().click(); await sleep(800);
     await p.getByText('Add new e-mail address').first().click({timeout:5000}); await sleep(600);
     await p.getByPlaceholder('Enter new email address').click(); await p.keyboard.type('x10-c'+c+'-'+(Date.now()%100000)+'@example.com',{delay:40}); await sleep(300);
     await p.getByRole('button',{name:'Add',exact:true}).last().click(); await sleep(1200);
     return await p.evaluate(()=>[...document.querySelectorAll('*')].find(e=>/^Recipients \(/.test(e.innerText||'')&&e.children.length==0)?.innerText); });
  await probe('c'+c+'-ext');
  await step('cast-crew-select',async()=>{ await p.getByText('Cast & crew',{exact:true}).first().click(); await sleep(1000);
     if(c%2===0){ await p.mouse.click(498,169); await sleep(500); await p.getByText('Select all').first().click(); await sleep(2500); }
     else { const cbs=p.locator('input[type=checkbox]'); let ok=0; for(let i=1;i<=10;i++){ try{await cbs.nth(i).check({force:true,timeout:2500});ok++;}catch(e){} await sleep(200);} }
     return await p.evaluate(()=>(document.body.innerText.match(/Recipients \((\d+)\)/)||[])[1]); });
  await probe('c'+c+'-selected');
  await step('recipient-search',async()=>{ const s=p.getByPlaceholder('Name, email or position').first(); for(const q of ['test','Mor','a','']){ await s.fill(q); await sleep(900);} });
  await probe('c'+c+'-search');
  await step('subject',async()=>{ await p.getByPlaceholder('Subject').last().fill('X1 external cycle '+c); });
  await step('type-greeting-enter',async()=>{ await p.locator('.ProseMirror').first().click(); await p.keyboard.type(['Dear Andreas,','Meine Lieben,','Hello team,'][c%3],{delay:60}); await p.keyboard.press('Enter'); await p.keyboard.type('Files for you, cycle '+c,{delay:40}); await p.keyboard.press('Enter'); await p.keyboard.press('Enter'); await p.keyboard.type('Best',{delay:40}); });
  await probe('c'+c+'-typed');
  await step('attach-multi-files',async()=>{ await p.getByRole('button',{name:'Add file from project'}).click({timeout:6000}); await sleep(2000);
     await p.mouse.click(698,552); await sleep(1800); await p.mouse.click(696,200); await sleep(2500);
     const pts=[[602,176],[861,176],[1120,176],[602,393],[861,393],[1120,393]]; for(const [x,y] of pts){ await p.mouse.click(x,y); await sleep(250);}
     if(c%2===0){ await p.mouse.move(900,500); await p.mouse.wheel(0,700); await sleep(800); }
     await p.screenshot({path:EV+'/files-c'+c+'.png'});
     await p.getByRole('button',{name:/^Attach \d+ file/}).click({timeout:5000}); await sleep(2500); return 'attached'; },60000);
  await probe('c'+c+'-files');
  await step('type-after-attach-enter',async()=>{ await p.locator('.ProseMirror').first().click(); await p.keyboard.press('Control+End'); await p.keyboard.press('Enter'); await p.keyboard.type('after attach',{delay:50}); await p.keyboard.press('Enter'); });
  await probe('c'+c+'-after-attach');
  if(c%2===1) await step('check-recipients',async()=>{ await p.getByRole('button',{name:/^Check recipients/}).click({timeout:5000}); await sleep(3500); await p.screenshot({path:EV+'/check-c'+c+'.png'}); });
  await step('idle-60s',async()=>{ await sleep(60000); },80000);
  await probe('c'+c+'-idle');
  if(false){ await step('SEND-NOW',async()=>{ await p.screenshot({path:EV+'/pre-send.png'}); await p.getByRole('button',{name:'Send now'}).click({timeout:5000}); await sleep(3000); await p.screenshot({path:EV+'/post-send-click.png'}); return await p.evaluate(()=>document.body.innerText.slice(-300)); },45000);
    await probe('c2-send');
  } else await step('save-draft',async()=>{ await p.getByRole('button',{name:'Save as draft'}).click({timeout:5000}); await sleep(3000); await p.screenshot({path:EV+'/draft-c'+c+'.png'}); });
  await probe('c'+c+'-saved');
  await step('close-modal',closeAll);
  for(const h of [['Crew','Files & Documents','Tasks','Script'][c%4],['Scenes','Dashboard','Time cards'][c%3]]) await step('nav-'+h,()=>navSide(h));
  await probe('c'+c+'-nav');
  await step('nav-dist-draft-reopen',async()=>{ await navSide('Distribution'); await p.getByText(/^Draft/).first().click(); await sleep(2500);
     await p.locator('tr:has-text("X1 external cycle")').first().click({timeout:6000}); await sleep(3500);
     await p.screenshot({path:EV+'/reopen-c'+c+'.png'}); return await p.locator('.ProseMirror').count(); });
  await probe('c'+c+'-reopened');
  await step('reopened-type-enter',async()=>{ if(await p.locator('.ProseMirror').count()){ await p.locator('.ProseMirror').first().click(); await p.keyboard.press('Control+End'); await p.keyboard.press('Enter'); await p.keyboard.type('reopened '+c,{delay:50}); await p.keyboard.press('Enter'); } });
  await probe('c'+c+'-reopen-typed');
  await step('reopened-next',async()=>{ const n=p.getByRole('button',{name:'Next',exact:true}); if(await n.count()){ await n.click({timeout:4000}); await sleep(2500);} }); await probe('c'+c+'-reopen-next'); await step('close-reopened',closeAll);
 }
 log({ev:'end',cycles:c}); await probe('end'); process.exit(0);
})().catch(e=>{log({ev:'fatal',err:e.message.slice(0,300)});process.exit(1)});
