const {conn,log,EV,sleep}=require('./lib.js');
(async()=>{
 const {b,p}=await conn();
 log({a:'login-start'});
 await p.goto('https://scotty.yamdu.com/',{waitUntil:'domcontentloaded',timeout:45000}); await sleep(4000);
 await p.screenshot({path:EV+'/01-login.png'});
 await p.locator('input[type=email],input[name*=mail i],input[type=text]').first().fill('sait@yamdu.com'); await p.keyboard.press('Enter'); await sleep(3000);
 await p.locator('input[type=password]').first().fill(process.env.PW_FROM_ENV); await p.keyboard.press('Enter'); await sleep(9000);
 await p.goto('https://scotty.yamdu.com/#5551/announcements:files:filedistribution',{waitUntil:'domcontentloaded'}); await sleep(6000);
 log({a:'login-done',url:p.url(),title:await p.title(),bundle:await p.evaluate(()=>[...document.scripts].map(s=>s.src).filter(s=>s.includes('bundles/js')))});
 await p.screenshot({path:EV+'/02-project.png'});
 process.exit(0);
})().catch(e=>{log({fatal:e.message.slice(0,300)});process.exit(1)});
