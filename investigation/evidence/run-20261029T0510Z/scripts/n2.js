const {conn,log,EV,sleep,probe}=require('./lib.js');
(async()=>{const {p}=await conn();
 log({a:'click Select multiple',pending:true}); await p.getByText('Select multiple',{exact:true}).first().click(); await sleep(2000); log({a:'click Select multiple',done:true});
 await p.screenshot({path:EV+'/08-selmulti.png'});
 const cbs=p.locator('input[type=checkbox]'); console.log('cb',await cbs.count());
 process.exit(0);})().catch(e=>{log({fatal:e.message.slice(0,300)});console.log(e.message.slice(0,200));process.exit(1)});
