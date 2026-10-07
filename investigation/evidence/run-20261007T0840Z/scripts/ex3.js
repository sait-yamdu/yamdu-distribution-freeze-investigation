const {chromium}=require('playwright');
(async()=>{
 const b=await chromium.connectOverCDP('http://localhost:9222');
 const p=b.contexts()[0].pages()[0];
 await p.mouse.click(499,168); await p.waitForTimeout(800);
 await p.screenshot({path:'06.png'});
 process.exit(0);
})();
