// CF2 sequence with ONLY valid UI navigation (sidebar/tab clicks). No location.hash writes.
const {chromium}=require('playwright');const fs=require('fs');
const EV=process.env.EV, LOG=process.env.LOG; const T0=Date.now();
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const log=o=>fs.appendFileSync(LOG,JSON.stringify({t:new Date().toISOString(),el_s:Math.round((Date.now()-T0)/1000),...o})+'\n');
let p; const bad=[]; const cerr=[];
async function probe(tag){const s=Date.now();const r=await Promise.race([p.evaluate(()=>({url:location.href,ed:document.querySelectorAll('.ProseMirror').length,loading:[...document.querySelectorAll('.loading_animation')].filter(e=>e.offsetParent).length,nodes:document.getElementsByTagName('*').length})),sleep(10000).then(()=>'TIMEOUT')]);log({ev:'probe',tag,dt:Date.now()-s,r});if(r==='TIMEOUT'){log({ev:'CANDIDATE_FREEZE',tag});fs.writeFileSync(EV+'CANDIDATE.txt',new Date().toISOString()+' '+tag);process.exit(3)}return r}
async function step(n,fn,to=25000){log({ev:'pending',n});const s=Date.now();try{const r=await Promise.race([fn(),sleep(to).then(()=>{throw new Error('step>'+to)})]);log({ev:'done',n,dt:Date.now()-s,r});return r}catch(e){log({ev:'error',n,dt:Date.now()-s,err:e.message.slice(0,200)});await probe('err-'+n)}}
async function settle(name){ // wait until no visible loading_animation (max 15s)
  const s=Date.now(); let n=-1;
  while(Date.now()-s<15000){ n=await p.evaluate(()=>[...document.querySelectorAll('.loading_animation')].filter(e=>e.offsetParent).length); if(n===0)break; await sleep(300);}
  return {url:p.url(),loadingVisible:n,waited_ms:Date.now()-s};
}
const side=async(href)=>{await p.locator(`a[href="${href}"]`).first().click({timeout:8000});};
async function toFileDist(){ await side('#5551/announcements'); await sleep(1500); if(!p.url().includes('filedistribution')){ await p.getByText('File distribution',{exact:true}).first().click({timeout:5000}); await sleep(1500);} return settle('dist'); }
async function selectAndCompose(subject,greeting,full){
  await step('add',async()=>{await p.getByRole('button',{name:'Add',exact:true}).first().click({timeout:8000});await sleep(2000)});
  await step('recips',async()=>{const b=p.locator('input[type=checkbox]');let ok=0;for(let i=1;i<=8;i++){try{await b.nth(i).check({timeout:3000,force:true});ok++}catch(e){}await sleep(150)}return ok});
  await step('ext-email',async()=>{await p.mouse.click(860,228);await p.keyboard.type('freeze-probe-x@example.com',{delay:40});await sleep(600);await p.keyboard.press('Enter');await sleep(1200)});
  await step('subject',async()=>{await p.getByPlaceholder('Subject').last().fill(subject)});
  await step('type',async()=>{await p.locator('.ProseMirror').first().click({timeout:5000});await p.keyboard.type(greeting,{delay:60});await p.keyboard.press('Enter');
    if(full){await p.keyboard.type('Please find the files attached. Line 1',{delay:40});await p.keyboard.press('Enter');await p.keyboard.press('Enter');await p.keyboard.type('Best regards',{delay:40});} await sleep(500)});
  await probe('composed');
}
(async()=>{
 const b=await chromium.connectOverCDP('http://localhost:9222');p=b.contexts()[0].pages()[0];
 p.on('response',r=>{if(r.status()>=400){const o={status:r.status(),url:r.url().slice(0,160)};bad.push(o);log({ev:'HTTP_ERROR',...o})}});
 p.on('requestfailed',r=>{const u=r.url();if(u.includes('yamdu'))log({ev:'request_failed_yamdu',url:u.slice(0,160),err:r.failure()&&r.failure().errorText})});
 p.on('console',m=>{if(m.type()==='error'){cerr.push(m.text().slice(0,200));log({ev:'console_error',text:m.text().slice(0,200)})}});
 p.on('pageerror',e=>log({ev:'pageerror',m:e.message.slice(0,200)}));
 log({ev:'start',url:p.url(),note:'C3: valid UI nav + single invalid #5551/scenes visit, UI return'});
 log({ev:'start',url:p.url(),note:process.env.NOTE});
 await step('ui-nav-files-and-documents',async()=>{await side('#5551/documents');await sleep(1500);return settle('docs')});
 await step('dwell',async()=>{await sleep(6000)});
 if(process.env.HASH) await step('invalid-hash '+process.env.HASH,async()=>{await p.evaluate(h=>{location.hash=h},process.env.HASH);await sleep(6000);return {url:p.url()}});
 if(process.env.RELOAD) await step('reload',async()=>{await p.reload({waitUntil:'domcontentloaded'});await sleep(6000);return {url:p.url()}});
 await step('back-to-filedistribution',async()=>{ if(process.env.BACKHASH){await p.evaluate(()=>{location.hash='#5551/announcements:files:filedistribution'});await sleep(3000);return settle('d')} return toFileDist()});
 await p.screenshot({path:EV+'01-dist.png'});
 await step('verify',async()=>({url:p.url(),http:bad.length,cerr:cerr.length}));
 await selectAndCompose('Freeze probe R3','Meine Lieben,',false);
 for(let i=0;i<8;i++){ await sleep(1000); await probe('after-enter-'+(i+1)+'s'); }
 await p.screenshot({path:EV+'02-after-enter.png'});
 log({ev:'end',result:'no freeze'}); process.exit(0);
})().catch(e=>{log({ev:'fatal',err:e.message.slice(0,200)});process.exit(1)});
