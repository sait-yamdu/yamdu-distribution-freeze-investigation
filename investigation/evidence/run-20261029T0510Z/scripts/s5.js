const {conn,log,EV,sleep,probe}=require('./lib.js');
(async()=>{const {p}=await conn();
 log({a:'select 3 tiles by mouse',pending:true});
 for(const [x,y] of [[770,380],[1022,380],[1274,380]]){await p.mouse.click(x,y); await sleep(700);}
 await p.screenshot({path:EV+'/09-selected.png'}); log({a:'select 3 tiles by mouse',done:true}); process.exit(0);})().catch(e=>{log({fatal:e.message.slice(0,300)});process.exit(1)});
