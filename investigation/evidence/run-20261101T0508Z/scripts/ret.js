const L=require('./lib');
// after hidden: verify vis events, probe, Enter in editor
(async()=>{const {p}=await L.conn();
const v=await p.evaluate(()=>window.__vis.map(x=>x[1]).join(",")+" hbmax="+Math.round(window.__hbmax));
const t=Date.now();const hb=await p.evaluate(()=>new Promise(r=>{const s=performance.now();setTimeout(()=>r(performance.now()-s),0)}));
L.log('after hidden: vis events='+v+' probe(timer)='+hb.toFixed(1)+'ms rtt='+(Date.now()-t)+'ms state='+await p.evaluate(()=>document.visibilityState));
const t2=Date.now();
L.log('PENDING Enter in editor');await p.mouse.click(940,520);await p.keyboard.press('Enter');await p.keyboard.type('x',{delay:30});
const pr=await Promise.race([p.evaluate(()=>1),new Promise(r=>setTimeout(()=>r('TIMEOUT'),8000))]);
L.log('COMPLETED Enter; post-probe='+pr+' in '+(Date.now()-t2)+'ms recips='+await p.evaluate(()=>(document.body.innerText.match(/Recipients \(\d+\)/)||[''])[0]));
process.exit(0)})().catch(e=>{console.log('ERR',e.message);process.exit(1)});
