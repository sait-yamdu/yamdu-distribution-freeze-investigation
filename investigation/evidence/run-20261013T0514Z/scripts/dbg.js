const {conn,EV}=require('./lib.js');
(async()=>{const {p}=await conn();await p.screenshot({path:EV+'/dbg-after-back.png'});
console.log(await p.evaluate(()=>[...document.querySelectorAll('button,[role=tab],a')].filter(e=>e.offsetParent).map(e=>(e.innerText||e.getAttribute('aria-label')||'').trim().slice(0,30)).filter(Boolean).join(' | ')));process.exit(0)})()
