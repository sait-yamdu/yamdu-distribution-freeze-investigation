const L=require('./lib');
(async()=>{const {b,p}=await L.conn();
await p.fill('#UserName','sait@yamdu.com');await p.keyboard.press('Enter');
await p.waitForSelector('#Password',{timeout:20000});await p.fill('#Password',process.env.PW_FROM_ENV);await p.keyboard.press('Enter');
await p.waitForTimeout(12000);L.log('login url '+p.url());
const s=await p.evaluate(()=>[...document.scripts].map(s=>s.src).find(s=>/bundles\/js/.test(s)));L.log('build '+s);
await p.screenshot({path:L.EV+'/01-after-login.png'});process.exit(0)})().catch(e=>{console.log('ERR',e.message);process.exit(1)});
