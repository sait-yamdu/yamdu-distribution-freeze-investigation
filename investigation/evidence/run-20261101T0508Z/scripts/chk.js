const L=require('./lib');
(async()=>{const {p}=await L.conn();await p.waitForTimeout(5000);L.log('url '+p.url());
const s=await p.evaluate(()=>[...document.scripts].map(s=>s.src).find(s=>/bundles\/js/.test(s)));L.log('build '+s);
await p.screenshot({path:L.EV+'/01-after-login.png'});process.exit(0)})().catch(e=>{console.log('ERR',e.message);process.exit(1)});
