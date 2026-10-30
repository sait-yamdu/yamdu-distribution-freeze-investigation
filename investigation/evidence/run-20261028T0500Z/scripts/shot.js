const {conn,log,EV,sleep,probe}=require('./lib.js');
(async()=>{const {p}=await conn(); await sleep(+process.argv[3]||3000); await p.screenshot({path:EV+'/'+process.argv[2]+'.png'}); log({a:'shot '+process.argv[2],url:p.url()}); process.exit(0);})();
