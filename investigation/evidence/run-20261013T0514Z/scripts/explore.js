const {conn,log,EV,sleep}=require('./lib.js');
(async()=>{
 const {b,p}=await conn();
 log({ev:'pending',name:'explore-open-draft'});
 await p.getByText(/^Draft/).first().click(); await sleep(2500);
 await p.screenshot({path:EV+'/x1-drafts.png'});
 const rows=await p.locator('tr').allInnerTexts(); console.log(rows.slice(0,8).map(r=>r.replace(/\s+/g,' ').slice(0,100)));
 await p.locator('tr:has-text("M1 explore")').first().click({timeout:6000}); await sleep(3500);
 await p.getByRole('button',{name:/^Check recipients/}).click({timeout:5000}); await sleep(2500);
 await p.screenshot({path:EV+'/x2-compose.png'});
 console.log(await p.evaluate(()=>[...document.querySelectorAll('button')].filter(b=>b.offsetParent).map(b=>(b.innerText||b.ariaLabel||'').trim()).filter(Boolean)));
 process.exit(0);
})().catch(e=>{console.log(e.message.slice(0,300));process.exit(1)});
