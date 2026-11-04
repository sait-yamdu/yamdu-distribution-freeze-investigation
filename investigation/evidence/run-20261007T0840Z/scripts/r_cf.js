const {chromium}=require('playwright');const fs=require('fs');
const EV=process.env.EV;
const LOG=process.env.LOG;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));const T0=Date.now();
const log=o=>fs.appendFileSync(LOG,JSON.stringify({t:new Date().toISOString(),el_s:Math.round((Date.now()-T0)/1000),...o})+'\n');
let p;
async function probe(tag){const s=Date.now();const r=await Promise.race([p.evaluate(()=>({ed:document.querySelectorAll('.ProseMirror').length,txt:[...document.querySelectorAll('.ProseMirror')].map(e=>e.innerText.slice(0,60)),nodes:document.getElementsByTagName('*').length,hbmax:window.__hb&&window.__hb.max})),sleep(8000).then(()=>'TIMEOUT')]);log({ev:'probe',tag,dt:Date.now()-s,r});if(r==='TIMEOUT'){log({ev:'CANDIDATE_FREEZE',tag});fs.writeFileSync(EV+'CANDIDATE-'+process.argv[2]+'.txt',new Date().toISOString()+' '+tag);process.exit(3)}}
async function step(n,fn,to=20000){log({ev:'pending',n});try{const r=await Promise.race([fn(),sleep(to).then(()=>{throw new Error('>'+to)})]);log({ev:'done',n,r});}catch(e){log({ev:'error',n,err:e.message.slice(0,150)});await probe('err-'+n)}}
(async()=>{
 const b=await chromium.connectOverCDP('http://localhost:9222');p=b.contexts()[0].pages()[0];
 await p.evaluate(()=>{const h=window.__hb={max:0};let l=performance.now();setInterval(()=>{const n=performance.now();h.max=Math.max(h.max,n-l-100);l=n},100)});
 log({ev:'start',url:p.url(),variant:process.argv[2]});
 await step('nav',async()=>{await p.evaluate(()=>{location.hash='#5551/announcements:files:filedistribution'});await sleep(3000)});
 await step('add',async()=>{await p.getByRole('button',{name:'Add',exact:true}).first().click({timeout:8000});await sleep(2000)});
 await step('recips',async()=>{const b=p.locator('input[type=checkbox]');let ok=0;for(let i=1;i<=8;i++){try{await b.nth(i).check({timeout:3000,force:true});ok++}catch(e){}await sleep(150)}return ok});
 await probe('recips');
 if(process.argv[2]!=='noext') await step('ext',async()=>{await p.mouse.click(860,228);await p.keyboard.type('freeze-probe-x@example.com',{delay:40});await sleep(600);await p.keyboard.press('Enter');await sleep(1200)});
 await probe('ext');
 await step('subject',async()=>{await p.getByPlaceholder('Subject').last().fill('Freeze probe CF '+process.argv[2])});
 await step('editor-click',async()=>{await p.locator('.ProseMirror').first().click({timeout:5000})});
 await probe('before-type');
 await step('type',async()=>{await p.keyboard.type('Meine Lieben,',{delay:60})},15000);
 await probe('typed-no-enter');
 await step('enter',async()=>{await p.keyboard.press('Enter');await sleep(1500)},15000);
 await probe('after-enter');
 await p.screenshot({path:EV+'cf-'+process.argv[2]+'-end.png'});
 log({ev:'end'});process.exit(0);
})().catch(e=>{log({ev:'fatal',err:e.message.slice(0,200)});process.exit(1)});
