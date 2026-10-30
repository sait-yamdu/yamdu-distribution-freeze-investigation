const {conn,EV,sleep}=require('./lib.js');
(async()=>{const {p}=await conn(); await p.mouse.move(950,500); await p.mouse.wheel(0,3000); await sleep(800);
 console.log(await p.evaluate(()=>[...document.querySelectorAll('button')].filter(b=>b.offsetParent).map(b=>(b.innerText.trim()||b.getAttribute('aria-label'))+(b.disabled?'(disabled)':'')).join(' | ')));
 await p.screenshot({path:EV+'/m1-btns2.png'}); process.exit(0)})()
