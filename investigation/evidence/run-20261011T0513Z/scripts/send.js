const {conn,log,EV,sleep}=require('./lib.js');
(async()=>{const {p}=await conn();
 log({ev:'pending',name:'SEND-NOW from step-2 share panel (10 recipients incl 2 new external example.com, 6 files 37MB)'});
 await p.getByRole('button',{name:'Send now'}).click({timeout:5000});
 for(const t of [2,5,10,20]){ await sleep(t*1000>5000?5000:t*1000); const r=await Promise.race([p.evaluate(()=>({m:document.body.innerText.length,ed:document.querySelectorAll('.ProseMirror').length,hb:Math.round(window.__hb.max)})),sleep(8000).then(()=>'TIMEOUT')]); log({ev:'probe',tag:'after-send+'+t,r}); }
 await p.screenshot({path:EV+'/post-send.png'}); process.exit(0);})().catch(e=>{console.log(e.message.slice(0,200));process.exit(1)});
