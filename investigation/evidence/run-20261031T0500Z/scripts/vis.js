const {conn,log,EV}=require('./lib');
(async()=>{const {b,p}=await conn();
const v=await p.evaluate(()=>window.__vis.map(x=>x[1]));
const h=v.filter(x=>x==='hidden').length;
log('VIS total='+v.length+' hidden_events='+h+' visible_events='+v.filter(x=>x==='visible').length);
process.exit(0)})();
