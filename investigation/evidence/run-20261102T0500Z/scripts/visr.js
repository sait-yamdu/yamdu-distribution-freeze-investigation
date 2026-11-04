const L=require('./lib');
(async()=>{const {p}=await L.conn();const v=await p.evaluate(()=>window.__vis);L.log('VIS '+JSON.stringify((v||[]).map(x=>x[0])));process.exit(0)})();
