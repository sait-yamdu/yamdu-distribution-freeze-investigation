const {conn,log,EV,sleep,probe}=require('./lib.js');
(async()=>{const {p}=await conn();
 const r=await p.evaluate(()=>{const cb=[...document.querySelectorAll('input[type=checkbox]')];const ed=[...document.querySelectorAll('[contenteditable=true]')].map(e=>e.className+'|'+e.parentElement.className);return {cb:cb.length,vis:cb.filter(c=>c.offsetParent).length,cls:cb.slice(0,3).map(c=>c.outerHTML.slice(0,200)),ed}});
 console.log(JSON.stringify(r,null,1)); process.exit(0);})();
