const {conn,log,EV,sleep,probe}=require('./lib.js');
(async()=>{const {p}=await conn();
 log({a:'select 3 tiles by mouse',pending:true});
 for(const [x,y] of [[770,380],[1022,380],[770,630]]){await p.mouse.click(x,y); await sleep(700);}
 log({a:'select 3 tiles by mouse',done:true});
 await p.screenshot({path:EV+'/09-selected.png'});
 console.log((await p.locator('body').innerText()).match(/Share[^\n]*/g));
 process.exit(0);})().catch(e=>{log({fatal:e.message.slice(0,300)});console.log(e.message.slice(0,200));process.exit(1)});
