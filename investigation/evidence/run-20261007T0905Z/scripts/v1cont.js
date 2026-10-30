const {chromium}=require('playwright');const fs=require('fs');
const EV=process.env.EV, LOG=process.env.LOG; const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const log=o=>fs.appendFileSync(LOG,JSON.stringify({t:new Date().toISOString(),...o})+'\n');
let p;
async function probe(tag){const s=Date.now();const r=await Promise.race([p.evaluate(()=>({txt:document.querySelector('.ProseMirror')&&document.querySelector('.ProseMirror').innerText.slice(-60)})),sleep(10000).then(()=>'TIMEOUT')]);log({ev:'probe',tag,dt:Date.now()-s,r});if(r==='TIMEOUT'){log({ev:'CANDIDATE_FREEZE',tag});fs.writeFileSync(EV+'CANDIDATE.txt',new Date().toISOString()+' '+tag);process.exit(3)}}
(async()=>{
 const b=await chromium.connectOverCDP('http://localhost:9222');p=b.contexts()[0].pages()[0];
 p.on('response',r=>{if(r.status()>=400)log({ev:'HTTP_ERROR',status:r.status(),url:r.url().slice(0,160)})});
 log({ev:'continue-same-session',url:p.url()});
 await probe('before');
 log({ev:'pending',n:'click-editor'}); await p.locator('.ProseMirror').first().click({timeout:5000}); await probe('after-click');
 log({ev:'pending',n:'End'}); await p.keyboard.press('End'); await probe('after-End');
 log({ev:'pending',n:'Enter'}); await Promise.race([p.keyboard.press('Enter'),sleep(12000)]); await probe('after-Enter');
 log({ev:'pending',n:'type reopened 1'}); await Promise.race([p.keyboard.type('reopened 1',{delay:50}),sleep(12000)]); await probe('after-type');
 await sleep(5000); await probe('after-5s'); await p.screenshot({path:EV+'05-after-enter-type.png'});
 log({ev:'end',result:'no freeze'}); process.exit(0);
})().catch(e=>{log({ev:'fatal',err:e.message.slice(0,200)});process.exit(1)});
