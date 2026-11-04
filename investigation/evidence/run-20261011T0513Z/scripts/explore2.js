const {conn,log,EV,sleep}=require('./lib.js');
(async()=>{const {p}=await conn(); p.on('dialog',d=>d.dismiss().catch(()=>{}));
 await p.getByRole('button',{name:'Save as draft'}).click(); await sleep(3000);
 for(let i=0;i<3;i++){await p.keyboard.press('Escape');await sleep(400);}
 const c=p.getByRole('button',{name:'Cancel',exact:true}); if(await c.count()) await c.last().click().catch(()=>{});
 await sleep(1000); await p.getByText(/^Draft/).first().click(); await sleep(2500);
 await p.locator('tr:has-text("M1 explore")').first().click(); await sleep(3500);
 await p.getByRole('button',{name:'Next',exact:true}).click(); await sleep(3000);
 await p.screenshot({path:EV+'/m1-02-step2.png'});
 console.log(await p.evaluate(()=>[...document.querySelectorAll('button')].filter(b=>b.offsetParent).map(b=>b.innerText.trim()).filter(Boolean).join(' | ')));
 process.exit(0)})().catch(e=>{console.log(e.message.slice(0,300));process.exit(1)});
