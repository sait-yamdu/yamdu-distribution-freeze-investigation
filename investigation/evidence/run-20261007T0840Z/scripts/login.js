const {chromium}=require('playwright');
(async()=>{
 const b=await chromium.connectOverCDP('http://localhost:9222');
 const ctx=b.contexts()[0]; const p=ctx.pages()[0];
 await p.goto('https://scotty.yamdu.com/#5551/announcements:files:filedistribution',{waitUntil:'domcontentloaded'});
 await p.waitForTimeout(4000);
 console.log(p.url());
 await p.screenshot({path:'01.png'});
 const inputs=await p.$$eval('input',e=>e.map(i=>[i.type,i.name,i.placeholder]));
 console.log(JSON.stringify(inputs));
 process.exit(0);
})();
