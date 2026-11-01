const {conn,EV,sleep,log}=require('./lib.js');
(async()=>{const {p}=await conn();
 await p.getByRole('button',{name:'Cancel',exact:true}).first().click({timeout:3000}).catch(()=>{});await sleep(800);
 const r=await p.evaluate(()=>{const ce=[...document.querySelectorAll('[contenteditable]')].map(e=>({tag:e.tagName,cls:e.className.slice(0,80),ce:e.getAttribute('contenteditable'),parent:e.parentElement.className.slice(0,80),txt:e.innerText.slice(0,40)}));
  const fr=document.querySelectorAll('.fr-element,.fr-box,.tiptap,.ProseMirror,.ql-editor,iframe').length;return {ce,fr,iframes:[...document.querySelectorAll('iframe')].map(i=>i.className+'|'+i.src.slice(0,60))}});
 console.log(JSON.stringify(r,null,1));log({ev:'dom',r});
 process.exit(0)})();
