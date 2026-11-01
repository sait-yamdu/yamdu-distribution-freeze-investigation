const L=require('./lib');
(async()=>{const {p}=await L.conn();
L.log('PENDING click Add external contact');
await p.getByRole('button',{name:'Add'}).first().click();await p.waitForTimeout(3000);
await p.screenshot({path:L.EV+'/04-addform.png'});
const f=await p.$$eval('input,textarea,select,button',e=>e.filter(x=>x.offsetParent).map(x=>[x.tagName,x.name||x.id||'',x.placeholder||'',(x.innerText||'').trim().slice(0,30)].join('|')));L.log(JSON.stringify(f));
process.exit(0)})().catch(e=>{console.log('ERR',e.message);process.exit(1)});
