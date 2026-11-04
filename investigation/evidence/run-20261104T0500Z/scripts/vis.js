const L=require('./lib');
(async()=>{const {p}=await L.conn();
await p.evaluate(()=>{window.__vis=window.__vis||[];if(!window.__visL){window.__visL=1;document.addEventListener('visibilitychange',()=>window.__vis.push([document.visibilityState,Date.now()]))}});
L.log('visibility logger installed');process.exit(0)})();
