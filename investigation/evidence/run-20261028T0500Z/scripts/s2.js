const {conn,log,EV,sleep,probe}=require('./lib.js');
(async()=>{const {p}=await conn();
 await p.mouse.click(442,590); await sleep(3500); await p.screenshot({path:EV+'/05-room.png'});
 log({a:'room clicked',url:p.url()}); process.exit(0);})().catch(e=>{log({fatal:e.message.slice(0,300)});process.exit(1)});
