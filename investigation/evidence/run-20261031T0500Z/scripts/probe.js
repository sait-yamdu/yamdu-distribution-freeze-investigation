const {conn,log,EV}=require('./lib');
(async()=>{const {b,p}=await conn();
const t=Date.now();const r=await Promise.race([p.evaluate(()=>document.querySelectorAll('*').length),new Promise(r=>setTimeout(()=>r('TIMEOUT'),6000))]);
log('probe '+(Date.now()-t)+'ms res='+r);
if(r!=='TIMEOUT'){log('recips: '+await p.getByText(/^Recipients \(\d+\)/).first().innerText().catch(()=>'?'));await p.screenshot({path:EV+'/s7state.png'});}
process.exit(0);})();
