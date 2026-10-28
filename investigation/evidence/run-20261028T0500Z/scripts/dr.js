const {conn,log,EV,sleep,probe}=require('./lib.js');
(async()=>{const {p}=await conn();
 log({a:'Save as draft',pending:true}); await p.getByRole('button',{name:'Save as draft'}).first().click(); await sleep(4000);
 log({a:'Save as draft',done:true,url:p.url()}); await probe(p,'after save draft'); await p.screenshot({path:EV+'/d1-saved.png'});
 log({a:'sidebar Distribution',pending:true}); await p.getByText('Distribution',{exact:true}).first().click({timeout:8000}).catch(e=>log({failed:'sidebar click '+e.message.slice(0,80)})); await sleep(4000);
 await p.screenshot({path:EV+'/d2-dist.png'}); log({a:'sidebar Distribution',done:true,url:p.url()}); await probe(p,'distribution'); process.exit(0);})().catch(e=>{log({fatal:e.message.slice(0,300)});process.exit(1)});
