const {conn,log,EV,sleep,probe}=require('./lib.js');
(async()=>{const {p}=await conn();
 log({a:'nav sidebar Files & Documents',pending:true});
 await p.getByText('Files & Documents',{exact:true}).first().click(); await sleep(5000);
 log({a:'nav sidebar Files & Documents',done:true,url:p.url()}); await probe(p,'docs');
 await p.screenshot({path:EV+'/04-docs.png'}); process.exit(0);})().catch(e=>{log({fatal:e.message.slice(0,300)});process.exit(1)});
