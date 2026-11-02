const L=require('./lib');
(async()=>{const {p}=await L.conn();
for(let i=0;i<6;i++){const t=Date.now();const r=await Promise.race([p.evaluate(()=>document.body.innerText.slice(0,0)+(document.body.innerText.includes('Creating item')?'creating':'done')+'|'+(document.body.innerText.includes('FRZ-Ext-1101')?'listed':'notlisted')),new Promise(r=>setTimeout(()=>r('TIMEOUT'),5000))]);L.log('probe '+r+' '+(Date.now()-t)+'ms');if(!/creating/.test(r))break;await new Promise(r=>setTimeout(r,8000))}
await p.screenshot({path:L.EV+'/10-wait.png'});process.exit(0)})().catch(e=>{console.log('ERR',e.message);process.exit(1)});
