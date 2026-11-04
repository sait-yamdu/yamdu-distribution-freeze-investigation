const {conn,EV,sleep}=require('./lib.js');
(async()=>{const {p}=await conn(); await p.mouse.move(950,500); await p.mouse.wheel(0,3000); await sleep(800);
 console.log(await p.evaluate(()=>[...document.querySelectorAll('button')].filter(b=>b.offsetParent).map(b=>b.innerText.trim()).filter(Boolean).join(' | ')));
 await p.screenshot({path:EV+'/m1-btns.png'}); process.exit(0)})()
