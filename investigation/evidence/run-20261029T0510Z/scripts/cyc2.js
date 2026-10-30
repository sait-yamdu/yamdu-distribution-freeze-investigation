const {conn,log,EV,sleep,probe}=require('./lib.js');
const http=require('http');
const jget=(path,m)=>new Promise((res,rej)=>{const r=http.request('http://localhost:9222'+path,{method:m||'GET'},x=>{let d='';x.on('data',c=>d+=c);x.on('end',()=>res(d))});r.on('error',rej);r.end()});
const c=+process.argv[2], hideSec=+process.argv[3]||75;
const cnt=async(p)=>parseInt((await p.getByText(/^Recipients \(/).first().innerText()).match(/\d+/)[0]);
(async()=>{let {b,p}=await conn();
 await p.getByText('Cast & crew',{exact:true}).first().click(); await sleep(800);
 let cur=await cnt(p); const bx=p.locator('input[type=checkbox][aria-label=Select]'); const n=await bx.count();
 for(let i=0;i<n&&cur<14;i++){const e=bx.nth(i); if(!(await e.isVisible()))continue; if(await e.isChecked())continue; await e.scrollIntoViewIfNeeded(); const bb=await e.boundingBox(); if(!bb)continue; await p.mouse.click(bb.x+10,bb.y+10); await sleep(300); cur=await cnt(p);}
 log({a:'ensure >=14 recipients',cyc:c,count:cur});
 if(c===1){ try{ await p.getByText(/^Recipients \(/).first().click(); await sleep(1000);
   await p.getByPlaceholder('Enter new email address').first().click(); await p.keyboard.type('ext.g1b@example.com',{delay:30}); await sleep(400);
   await p.getByRole('button',{name:'Add',exact:true}).first().click(); await sleep(1500); log({a:'external email added',count:await cnt(p)}); await p.screenshot({path:EV+'/r2-ext.png'});}catch(e){log({a:'external email',failed:e.message.slice(0,150)});} }
 await probe(p,'r2 after recipients');
 const ed=p.locator('.mantine-RichTextEditor-content .tiptap').first(); await ed.click(); await p.keyboard.press('Control+End'); await p.keyboard.press('Enter'); await p.keyboard.type('Meine Lieben,',{delay:40}); await p.keyboard.press('Enter'); await p.keyboard.type('r2 cycle '+c,{delay:30}); await probe(p,'r2 after Enter');
 const tgt=JSON.parse(await jget('/json')).find(t=>t.type==='page'&&t.url.includes('scotty'));
 log({a:'r2 hide',pending:true,cyc:c,hideSec,count:await cnt(p)});
 await b.close().catch(()=>{}); const nt=JSON.parse(await jget('/json/new?about:blank','PUT')); await sleep(hideSec*1000);
 await jget('/json/activate/'+tgt.id); await sleep(1500); await jget('/json/close/'+nt.id);
 ({b,p}=await conn()); const v=await p.evaluate(()=>({vis:window.__vis.map(x=>x[1]).join(','),gap:window.__maxgap}));
 log({a:'r2 hide',done:true,cyc:c,vis:v.vis,maxgap:v.gap,count:await cnt(p)}); await probe(p,'r2 after hidden');
 const ed2=p.locator('.mantine-RichTextEditor-content .tiptap').first(); await ed2.click(); await p.keyboard.press('Control+End'); await p.keyboard.press('Enter'); await p.keyboard.type('Dear Andreas,',{delay:40}); await p.keyboard.press('Enter'); await p.keyboard.press('Enter');
 await probe(p,'r2 after return+Enter x2'); await p.screenshot({path:EV+'/r2-c'+c+'.png'});
 process.exit(0);})().catch(e=>{log({fatal:e.message.slice(0,300),cyc:c});process.exit(1)});
