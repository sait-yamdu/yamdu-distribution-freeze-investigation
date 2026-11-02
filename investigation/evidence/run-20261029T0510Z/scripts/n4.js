const {conn,log,EV,sleep,probe}=require('./lib.js');
(async()=>{const {p}=await conn();
 log({a:'click Share files',pending:true}); await p.getByText('Share files',{exact:true}).first().click(); await sleep(4000);
 log({a:'click Share files',done:true}); await probe(p,'share modal'); await p.screenshot({path:EV+'/10-sharemodal.png'});
 process.exit(0);})().catch(e=>{log({fatal:e.message.slice(0,300)});console.log(e.message.slice(0,200));process.exit(1)});
