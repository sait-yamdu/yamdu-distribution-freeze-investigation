const {conn,log,EV}=require('./lib');
(async()=>{const {b,p}=await conn();p.setDefaultTimeout(8000);
await p.waitForTimeout(3000);
const open=await p.getByText('Mail details').count();log('modal open='+open+' url='+p.url());
await p.screenshot({path:EV+'/d2a.png'});
process.exit(0)})().catch(e=>{console.log('ERR',e.message.slice(0,300));process.exit(1)});
