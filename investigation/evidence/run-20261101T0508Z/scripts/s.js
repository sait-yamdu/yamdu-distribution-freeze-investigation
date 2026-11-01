const L=require('./lib');
(async()=>{const {p}=await L.conn();L.log('url '+p.url());await p.screenshot({path:L.EV+'/snap.png'});
console.log(await p.evaluate(()=>[document.querySelectorAll('input[name=name]').length,[...document.querySelectorAll('input[name=name]')].map(e=>e.offsetParent!==null)]));process.exit(0)})().catch(e=>{console.log('ERR',e.message);process.exit(1)});
