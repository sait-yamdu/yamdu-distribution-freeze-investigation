const {conn,EV,sleep}=require('./lib.js');
(async()=>{const {p}=await conn(); await p.screenshot({path:EV+'/m2-dbg1.png'});
 console.log(await p.evaluate(()=>[...document.querySelectorAll('button')].filter(b=>b.offsetParent&&/^Next$/.test(b.innerText.trim()||b.getAttribute('aria-label'))).map(b=>[b.innerText.trim(),b.getAttribute('aria-label'),b.disabled,JSON.stringify(b.getBoundingClientRect())].join(',')).join('\n')));
 process.exit(0)})()
