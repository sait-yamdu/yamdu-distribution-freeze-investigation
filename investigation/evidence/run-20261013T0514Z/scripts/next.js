const {conn,log,EV,sleep}=require('./lib.js');
(async()=>{const {p}=await conn();
 log({ev:'pending',name:'reopened-draft-click-Next (10 recipients, accumulated text)'});
 await p.getByRole('button',{name:'Next',exact:true}).click({timeout:5000}); await sleep(3000);
 const r=await Promise.race([p.evaluate(()=>document.body.innerText.slice(0,200)),sleep(8000).then(()=>'TIMEOUT')]);
 log({ev:'done',name:'Next',r:String(r).slice(0,100)});
 await p.screenshot({path:EV+'/next-step.png'}); process.exit(0);})().catch(e=>{console.log(e.message.slice(0,200));process.exit(1)});
