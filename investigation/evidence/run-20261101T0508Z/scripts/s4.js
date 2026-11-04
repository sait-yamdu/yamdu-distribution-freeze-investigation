const L=require('./lib');
(async()=>{const {b,p,c}=await L.conn();L.log('pages '+c.pages().map(x=>x.url().slice(0,70)).join(' | '));
for(const q of c.pages()){console.log(q.url().slice(0,60),await q.evaluate(()=>document.visibilityState+' vis='+typeof window.__vis))}
process.exit(0)})().catch(e=>{console.log('ERR',e.message);process.exit(1)});
