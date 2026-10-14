const {conn,log,EV,sleep}=require('./lib.js');
(async()=>{const {p}=await conn(); p.on('dialog',d=>d.dismiss().catch(()=>{}));
 log({ev:'pending',name:'M1-explore: add modal, recipients, attach, Next'});
 await p.getByRole('button',{name:'Add',exact:true}).first().click(); await sleep(2000);
 await p.getByText('Cast & crew',{exact:true}).first().click(); await sleep(1000);
 const cbs=p.locator('input[type=checkbox]'); for(let i=1;i<=6;i++){try{await cbs.nth(i).check({force:true,timeout:2000})}catch(e){}}
 await p.getByPlaceholder('Subject').last().fill('M1 explore'); await p.locator('.ProseMirror').first().click(); await p.keyboard.type('Dear Andreas,',{delay:50}); await p.keyboard.press('Enter');
 await p.getByRole('button',{name:'Add file from project'}).click(); await sleep(2000);
 await p.mouse.click(698,552); await sleep(1800); await p.mouse.click(696,200); await sleep(2500);
 for(const [x,y] of [[602,176],[861,176],[1120,176]]){await p.mouse.click(x,y);await sleep(250);}
 await p.getByRole('button',{name:/^Attach \d+ file/}).click(); await sleep(2500);
 await p.screenshot({path:EV+'/m1-01-before-next.png'});
 await p.getByRole('button',{name:'Next',exact:true}).click(); await sleep(3000);
 await p.screenshot({path:EV+'/m1-02-step2.png'});
 console.log(await p.evaluate(()=>[...document.querySelectorAll('button')].filter(b=>b.offsetParent).map(b=>b.innerText.trim()).filter(Boolean).join(' | ')));
 process.exit(0)})().catch(e=>{console.log(e.message.slice(0,300));process.exit(1)});
