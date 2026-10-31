const {conn,log,EV,sleep,probe}=require('./lib.js');
(async()=>{const {p}=await conn();
 log({a:'click Share files',pending:true}); await p.mouse.click(715,253); await sleep(4000);
 await p.screenshot({path:EV+'/10-sharemodal.png'}); log({a:'click Share files',done:true}); await probe(p,'share modal'); process.exit(0);})().catch(e=>{log({fatal:e.message.slice(0,300)});process.exit(1)});
