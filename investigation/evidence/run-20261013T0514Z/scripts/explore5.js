const {conn,log,EV,sleep}=require('./lib.js');
(async()=>{
 const {b,p}=await conn();
 await p.getByRole('button',{name:/^Check recipients/}).click(); await sleep(2500);
 console.log(await p.evaluate(()=>[...document.querySelectorAll('button')].filter(b=>b.offsetParent).map(b=>(b.innerText||'').trim()).filter(Boolean).slice(-6)));
 await p.evaluate(()=>{const bs=[...document.querySelectorAll('button')].filter(b=>b.offsetParent&&/^\s*Next\s*$/.test(b.innerText||'')).sort((a,b)=>b.getBoundingClientRect().y-a.getBoundingClientRect().y); bs[0].click();}); await sleep(3500);
 await p.screenshot({path:EV+'/x8-panel.png'});
 console.log(await p.evaluate(()=>[...document.querySelectorAll('button,label,[role=radio],[role=tab]')].filter(b=>b.offsetParent).map(b=>(b.innerText||'').trim()).filter(Boolean)));
 process.exit(0);
})().catch(e=>{console.log(e.message.slice(0,300));process.exit(1)});
