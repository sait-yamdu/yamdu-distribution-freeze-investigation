const {conn,log,EV,sleep}=require('./lib.js');
(async()=>{
 const {b,p}=await conn();
 await p.mouse.click(1295,36); await sleep(1500);
 await p.evaluate(()=>{const bs=[...document.querySelectorAll('button')].filter(b=>b.offsetParent&&/^\s*Next\s*$/.test(b.innerText||'')).sort((a,b)=>b.getBoundingClientRect().y-a.getBoundingClientRect().y); bs[0].click();}); await sleep(3000);
 await p.screenshot({path:EV+'/x5-panel.png'});
 console.log(await p.evaluate(()=>[...document.querySelectorAll('button,[role=button],label')].filter(b=>b.offsetParent).map(b=>(b.innerText||'').trim()).filter(Boolean).slice(-25)));
 process.exit(0);
})().catch(e=>{console.log(e.message.slice(0,300));process.exit(1)});
