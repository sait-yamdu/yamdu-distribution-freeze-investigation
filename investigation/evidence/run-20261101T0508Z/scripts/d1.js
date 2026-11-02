const L=require('./lib');(async()=>{const {p}=await L.conn();
L.log('d PENDING Save as draft');
await p.getByRole('button',{name:/save.*draft/i}).first().scrollIntoViewIfNeeded().catch(()=>{});
await p.screenshot({path:L.EV+'/d1a.png'});
const bs=await p.$$eval('button',e=>e.filter(x=>x.offsetParent).map(x=>x.innerText.trim()).filter(Boolean).slice(-12));L.log(JSON.stringify(bs));
process.exit(0)})().catch(e=>{L.log('ERR '+e.message.split('\n')[0]);process.exit(1)})
