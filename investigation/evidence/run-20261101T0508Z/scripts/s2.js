const L=require('./lib');
(async()=>{const {p}=await L.conn();
console.log(await p.evaluate(()=>({n:document.querySelectorAll('input').length,vis:[...document.querySelectorAll('input')].filter(e=>e.offsetParent).map(e=>e.name+'|'+e.id+'|'+e.type),hasShadow:[...document.querySelectorAll('*')].filter(e=>e.shadowRoot).length,iframes:document.querySelectorAll('iframe').length, active:document.activeElement&&document.activeElement.outerHTML.slice(0,150)})));process.exit(0)})().catch(e=>{console.log('ERR',e.message);process.exit(1)});
