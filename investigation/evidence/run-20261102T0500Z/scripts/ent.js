const L=require('./lib');
(async()=>{const {p}=await L.conn();const tag=process.argv[2];
L.log(tag+' ENTER block PENDING');const t0=Date.now();
await p.mouse.click(900,640);await p.keyboard.press('Control+End');
for(const w of ['Dear Andreas,','Meine Lieben,','x']){await p.keyboard.type(w,{delay:40});await p.keyboard.press('Enter');}
const r=await Promise.race([p.evaluate(()=>[document.visibilityState,document.querySelectorAll('*').length,Math.round(performance.memory.usedJSHeapSize/1e6)]),new Promise(r=>setTimeout(()=>r('TIMEOUT'),8000))]);
L.log(tag+' ENTER block DONE ms='+(Date.now()-t0)+' state='+JSON.stringify(r));process.exit(0)})().catch(e=>{console.log('ERR',e.message);process.exit(1)});
