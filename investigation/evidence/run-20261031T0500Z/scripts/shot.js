const {conn,EV}=require('./lib');
(async()=>{const {b,p}=await conn();await p.screenshot({path:EV+'/cur.png'});process.exit(0)})();
