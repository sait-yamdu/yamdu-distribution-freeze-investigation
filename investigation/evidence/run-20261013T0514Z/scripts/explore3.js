const {conn,log,EV,sleep}=require('./lib.js');
(async()=>{
 const {b,p}=await conn();
 await p.getByPlaceholder('Name',{exact:true}).fill('M3 ml '+Date.now()%100000); await p.getByRole('button',{name:'Confirm'}).click(); await sleep(2500);
 await p.screenshot({path:EV+'/x4-after-store.png'});
 await p.getByRole('button',{name:'Add file from project'}).click(); await sleep(2000);
 await p.mouse.click(698,552); await sleep(1800); await p.mouse.click(696,200); await sleep(2500);
 for(const [x,y] of [[861,393],[1120,393]]){ await p.mouse.click(x,y); await sleep(250);}
 await p.getByRole('button',{name:/^Attach \d+ file/}).click({timeout:5000}); await sleep(2500);
 await p.evaluate(()=>{const bs=[...document.querySelectorAll('button')].filter(b=>b.offsetParent&&/^\s*Next\s*$/.test(b.innerText||'')).sort((a,b)=>b.getBoundingClientRect().y-a.getBoundingClientRect().y); bs[0].click();}); await sleep(3000);
 await p.screenshot({path:EV+'/x5-panel.png'});
 console.log(await p.evaluate(()=>[...document.querySelectorAll('button,[role=button],label')].filter(b=>b.offsetParent).map(b=>(b.innerText||'').trim()).filter(Boolean).slice(-25)));
 process.exit(0);
})().catch(e=>{console.log(e.message.slice(0,300));process.exit(1)});
