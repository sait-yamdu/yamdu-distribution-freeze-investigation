const {conn,log,EV}=require('./lib');
(async()=>{const {b,p}=await conn();p.setDefaultTimeout(8000);
log('PENDING sidebar Distribution');
await p.getByText('Distribution',{exact:true}).first().click();await p.waitForTimeout(4000);
log('url='+p.url());
const t=p.getByText(/^Draft/).first();log('draft tab count='+await p.getByText(/^Draft/).count());
await t.click();await p.waitForTimeout(3000);
await p.screenshot({path:EV+'/d3a.png'});
process.exit(0)})().catch(e=>{console.log('ERR',e.message.slice(0,300));process.exit(1)});
