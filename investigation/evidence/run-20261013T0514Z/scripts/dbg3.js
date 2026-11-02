const {conn,EV,sleep}=require('./lib.js');(async()=>{const {p}=await conn();
 const t=Date.now();
 const info=await p.evaluate(()=>{const h=[...document.querySelectorAll('*')].find(e=>e.children.length===0&&e.textContent.trim()==='Send at a scheduled time'&&e.tagName!=='BUTTON'); let d=h; for(let i=0;i<8&&d;i++){d=d.parentElement; if(d&&d.querySelectorAll('input').length) break;} return d?{cls:d.className.slice(0,60),role:d.getAttribute('role'),inputs:[...d.querySelectorAll('input')].map(i=>[i.type,i.value,i.readOnly,i.className.slice(0,40)])}:null;});
 console.log(JSON.stringify(info));process.exit(0)})()
