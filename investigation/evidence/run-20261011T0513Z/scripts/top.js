const {conn,EV,sleep}=require('./lib.js');
(async()=>{const {p}=await conn(); await p.mouse.move(1000,300); await p.mouse.wheel(0,-3000); await sleep(800); await p.screenshot({path:EV+'/m1-share-top.png'});
 console.log(await p.evaluate(()=>[...document.querySelectorAll('button,input,[role=tab]')].filter(b=>b.offsetParent).map(b=>(b.tagName+':'+(b.innerText||b.placeholder||b.getAttribute('aria-label')||b.type||'').trim().slice(0,30))).join(' | ')));
 process.exit(0)})()
