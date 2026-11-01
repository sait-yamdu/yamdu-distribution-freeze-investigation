const {conn,log,EV,sleep}=require('./lib.js');
(async()=>{const {p}=await conn(); log({ev:'pending',name:'M1-explore click Check recipients on reopened draft'});
 await p.getByRole('button',{name:/^Check recipients/}).click({timeout:5000}); await sleep(3500);
 await p.screenshot({path:EV+'/m1-03-check.png'});
 console.log(await p.evaluate(()=>[...document.querySelectorAll('button')].filter(b=>b.offsetParent&&b.closest('[role=dialog],.mantine-Modal-root,.mantine-Drawer-root')).map(b=>(b.innerText.trim()||b.getAttribute('aria-label'))+(b.disabled?'(disabled)':'')).filter(s=>s&&s!=='More Options').join(' | ')));
 log({ev:'done',name:'check recipients explore'}); process.exit(0)})().catch(e=>{console.log(e.message.slice(0,300));process.exit(1)});
