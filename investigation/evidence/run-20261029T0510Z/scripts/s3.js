const {conn,log,EV,sleep,probe}=require('./lib.js');
(async()=>{const {p}=await conn();
 await p.mouse.click(386,400); await sleep(4000); await p.screenshot({path:EV+'/06-doc.png'});
 log({a:'doc opened',url:p.url()}); process.exit(0);})().catch(e=>{log({fatal:e.message.slice(0,300)});process.exit(1)});
