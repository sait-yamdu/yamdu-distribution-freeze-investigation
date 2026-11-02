const {chromium}=require('playwright');
(async()=>{
 const b=await chromium.connectOverCDP('http://localhost:9222');
 const p=b.contexts()[0].pages()[0];
 await p.fill('input[name=UserName]',process.env.YU);
 await p.keyboard.press('Enter'); await p.waitForTimeout(1500);
 const pw=p.locator('input[name=Password]');
 if(!(await pw.isVisible())){ const nx=p.getByRole('button',{name:/next/i}); if(await nx.count()) await nx.first().click(); await p.waitForTimeout(1500);}
 await pw.fill(process.env.YP); await p.keyboard.press('Enter');
 await p.waitForTimeout(8000);
 console.log(p.url()); await p.screenshot({path:'02.png'});
 process.exit(0);
})();
