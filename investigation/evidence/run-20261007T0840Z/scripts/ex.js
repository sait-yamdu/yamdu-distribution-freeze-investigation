const {chromium}=require('playwright');
(async()=>{
 const b=await chromium.connectOverCDP('http://localhost:9222');
 const p=b.contexts()[0].pages()[0];
 await p.mouse.click(860,228);
 await p.waitForTimeout(1500);
 await p.screenshot({path:'05.png'});
 console.log(await p.evaluate(()=>[...document.querySelectorAll('button')].filter(x=>x.offsetParent).map(x=>x.innerText.trim()).filter(Boolean).join(' | ')));
 process.exit(0);
})();
