const {conn,log,EV}=require('./lib');
(async()=>{const {b,p}=await conn();p.setDefaultTimeout(8000);
log('PENDING Save as draft');
await p.getByRole('button',{name:'Save as draft'}).first().click();await p.waitForTimeout(3500);
log('after save url='+p.url());await p.screenshot({path:EV+'/d1a.png'});
process.exit(0)})().catch(e=>{console.log('ERR',e.message.slice(0,300));process.exit(1)});
