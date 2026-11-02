const L=require('./lib');(async()=>{const {p}=await L.conn();
await p.evaluate(()=>{window.__vis=[];if(window.__v2)return;window.__v2=1;document.addEventListener('visibilitychange',()=>window.__vis.push([Date.now(),document.visibilityState]));window.__hbmax=0;let l=performance.now();setInterval(()=>{const n=performance.now();window.__hbmax=Math.max(window.__hbmax,n-l);l=n},250)});
L.log('listener injected');process.exit(0)})()
