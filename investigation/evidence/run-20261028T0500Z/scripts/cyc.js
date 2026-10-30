const {conn,log,EV,sleep,probe}=require('./lib.js');
const http=require('http');
const jget=(path,m)=>new Promise((res,rej)=>{const r=http.request('http://localhost:9222'+path,{method:m||'GET'},x=>{let d='';x.on('data',c=>d+=c);x.on('end',()=>res(d))});r.on('error',rej);r.end()});
const c=+process.argv[2], hideSec=+process.argv[3]||75;
(async()=>{
 let {b,p}=await conn();
 const step=async(name,fn)=>{log({a:name,pending:true,cyc:c});try{await fn();log({a:name,done:true,cyc:c});}catch(e){log({a:name,failed:e.message.slice(0,160),cyc:c});}};
 if(c===1) await p.evaluate(()=>{window.__vis=[];window.__hb=[];document.addEventListener('visibilitychange',()=>window.__vis.push([Date.now(),document.visibilityState]));let l=Date.now();window.__maxgap=0;setInterval(()=>{const n=Date.now();window.__maxgap=Math.max(window.__maxgap,n-l);l=n},1000);});
 // tick recipients
 await step('tick recipients',async()=>{
   const boxes=p.locator('input[type=checkbox][aria-label=Select]'); const n=await boxes.count(); let k=0; if(c>1){let u=0;for(let i=0;i<n&&u<4;i++){const bx=boxes.nth(i); if((await bx.isVisible())&&(await bx.isChecked())){await bx.scrollIntoViewIfNeeded();const bb=await bx.boundingBox();if(bb){await p.mouse.click(bb.x+bb.width/2,bb.y+bb.height/2);u++;await sleep(250);}}} log({unticked:u});}
   for(let i=0;i<n&&k<14;i++){const bx=boxes.nth(i); if(!(await bx.isVisible()))continue; const checked=await bx.isChecked(); if(c>1&&i%2===c%2){ } if(!checked){await bx.scrollIntoViewIfNeeded(); const bb=await bx.boundingBox(); if(bb){await p.mouse.click(bb.x+bb.width/2,bb.y+bb.height/2);k++;await sleep(250);}}}
   log({ticked:k});
 }); await probe(p,'after tick');
 if(c===1){
  await step('recipients tab + add external email',async()=>{
   await p.getByText(/^Recipients \(/).first().click(); await sleep(1500);
   await p.getByText('Add new e-mail address').first().click(); await sleep(1000);
   await p.getByPlaceholder('Enter new email address').first().click(); await p.keyboard.type('ext.g1.c'+c+'@example.com',{delay:30}); await sleep(500);
   await p.getByRole('button',{name:'Add',exact:true}).first().click(); await sleep(1500);
   await p.screenshot({path:EV+'/c'+c+'-ext.png'});
  }); await probe(p,'after ext email');
 }
 await step('subject+message',async()=>{
   await p.getByPlaceholder('Subject').first().fill('G1 test c'+c); 
   const ed=p.locator('.mantine-RichTextEditor-content .tiptap').first(); await ed.click(); await p.keyboard.press('Control+End');
   await p.keyboard.type(c%2?'Meine Lieben,':'Dear Andreas,',{delay:40}); await p.keyboard.press('Enter'); await p.keyboard.type('Test cycle '+c,{delay:30});
 }); const pr=await probe(p,'after type+Enter'); await p.screenshot({path:EV+'/c'+c+'-typed.png'});
 // REAL hidden phase
 const tabs=JSON.parse(await jget('/json')); const tgt=tabs.find(t=>t.type==='page'&&t.url.includes('scotty'));
 log({a:'hide-phase',pending:true,cyc:c,hideSec,target:tgt.id.slice(0,6)});
 await b.close().catch(()=>{}); // disconnect playwright only
 const nt=JSON.parse(await jget('/json/new?about:blank','PUT')); // new tab (activated)
 await sleep(hideSec*1000);
 await jget('/json/activate/'+tgt.id); await sleep(1500);
 await jget('/json/close/'+nt.id);
 ({b,p}=await conn());
 const v=await p.evaluate(()=>({vis:window.__vis,gap:window.__maxgap,now:document.visibilityState}));
 log({a:'hide-phase',done:true,cyc:c,vis_events:v.vis,maxgap_ms:v.gap,now:v.now}); await probe(p,'after hidden');
 // type after return
 await step('type after return + Enter',async()=>{
   const ed=p.locator('.mantine-RichTextEditor-content .tiptap').first(); await ed.click(); await p.keyboard.press('Control+End'); await p.keyboard.press('Enter');
   await p.keyboard.type('Dear Andreas,',{delay:40}); await p.keyboard.press('Enter'); await p.keyboard.type('nach hidden '+c,{delay:30});
 }); await probe(p,'after return+Enter'); await p.screenshot({path:EV+'/c'+c+'-after.png'});
 process.exit(0);
})().catch(e=>{log({fatal:e.message.slice(0,300)});process.exit(1)});
