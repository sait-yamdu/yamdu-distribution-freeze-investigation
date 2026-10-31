const {conn,log,EV,sleep,probe}=require('./lib.js');
const http=require('http');
const jget=(path,m)=>new Promise((res,rej)=>{const r=http.request('http://localhost:9222'+path,{method:m||'GET'},x=>{let d='';x.on('data',c=>d+=c);x.on('end',()=>res(d))});r.on('error',rej);r.end()});
const cnt=async(p)=>await p.getByText(/^Recipients \(/).first().innerText();
(async()=>{let {b,p}=await conn();
 log({a:'RC tick 10 recipients',pending:true});
 const bx=p.locator('input[type=checkbox][aria-label=Select]'); const n=await bx.count(); let k=0;
 for(let i=0;i<n&&k<10;i++){const e=bx.nth(i); if(!(await e.isVisible()))continue; if(await e.isChecked())continue; await e.scrollIntoViewIfNeeded(); const bb=await e.boundingBox(); await p.mouse.click(bb.x+10,bb.y+10); k++; await sleep(300);}
 log({a:'RC tick 10 recipients',done:true,clicked:k,count_before_hide:await cnt(p)});
 const tgt=JSON.parse(await jget('/json')).find(t=>t.type==='page'&&t.url.includes('scotty'));
 await b.close().catch(()=>{}); const nt=JSON.parse(await jget('/json/new?about:blank','PUT')); await sleep(60000);
 await jget('/json/activate/'+tgt.id); await sleep(1500); await jget('/json/close/'+nt.id);
 ({b,p}=await conn()); log({a:'RC after hidden',count_after_hide:await cnt(p)}); await probe(p,'rc after hidden');
 process.exit(0);})().catch(e=>{log({fatal:e.message.slice(0,200)});process.exit(1)});
