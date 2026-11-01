const {conn,log,EV,sleep,probe}=require('./lib.js');
(async()=>{const {p}=await conn();
 log({a:'click Select multiple',pending:true}); await p.mouse.click(1231,205); await sleep(2000);
 await p.screenshot({path:EV+'/08-selmulti.png'}); log({a:'click Select multiple',done:true}); process.exit(0);})().catch(e=>{log({fatal:e.message.slice(0,300)});process.exit(1)});
