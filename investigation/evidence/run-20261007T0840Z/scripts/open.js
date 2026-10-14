const {chromium}=require('playwright');
(async()=>{
 const b=await chromium.connectOverCDP('http://localhost:9222');
 const p=b.contexts()[0].pages()[0];
 const btns=await p.$$eval('button',e=>e.filter(x=>x.offsetParent).map(x=>x.innerText.trim()).filter(Boolean).slice(0,40));
 console.log(JSON.stringify(btns));
 await p.getByRole('button',{name:'Add'}).first().click().catch(e=>console.log('noclick',e.message.slice(0,80)));
 await p.waitForTimeout(2500);
 await p.screenshot({path:'04.png'});
 console.log(await p.evaluate(()=>[...document.querySelectorAll('[role=dialog],.modal')].map(d=>d.innerText.slice(0,500)).join('\n---\n')));
 process.exit(0);
})();
