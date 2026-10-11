const {conn,sleep}=require('./lib.js');(async()=>{const {p}=await conn();
 console.log(await p.evaluate(()=>[...document.querySelectorAll('button')].filter(b=>b.offsetParent&&/Next/.test((b.innerText||'')+(b.getAttribute('aria-label')||''))).map(b=>JSON.stringify([b.innerText,b.getAttribute('aria-label'),Math.round(b.getBoundingClientRect().y)])).join(' ')));process.exit(0)})()
