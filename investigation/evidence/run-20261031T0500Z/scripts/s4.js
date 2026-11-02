const {conn,log,EV}=require('./lib');
(async()=>{const {b,p}=await conn();
log('PENDING select 3 files + share');
for(const [x,y] of [[770,375],[1020,375],[770,625]]){await p.mouse.click(x,y);await p.waitForTimeout(500);}
await p.screenshot({path:EV+'/04-picked.png'});
const sf=p.getByText('Share files').first();
log('sharefiles count='+await p.getByText('Share files').count());
await sf.click(); await p.waitForTimeout(4000);
await p.screenshot({path:EV+'/05-modal.png'});
log('DONE modal opened');
await b.close();})();
