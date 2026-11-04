const {conn,log,EV}=require('./lib');
const http=require('http');
const req=(method,path)=>new Promise((res,rej)=>{const r=http.request({host:'127.0.0.1',port:9222,path,method},x=>{let d='';x.on('data',c=>d+=c);x.on('end',()=>res(d))});r.on('error',rej);r.end()});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const N=+process.argv[2]||10, HID=+process.argv[3]||100;
(async()=>{
const t0=Date.now();
log(`CYCLES start N=${N} hidden=${HID}s`);
for(let i=1;i<=N;i++){
 let {b,p}=await conn();
 const id=(await req('GET','/json')).match(/"id": "([^"]+)"[^]*?"url": "https:\/\/scotty/)?.[1];
 const tabs=JSON.parse(await req('GET','/json')).filter(t=>t.type==='page'&&/scotty/.test(t.url));
 const tid=tabs[0].id;
 log(`c${i} PENDING type (age ${Math.round((Date.now()-t0)/60000)}m)`);
 const t1=Date.now();
 const pr=await Promise.race([p.evaluate(()=>1+1),sleep(8000).then(()=>'TIMEOUT')]);
 log(`c${i} probe pre=${Date.now()-t1}ms res=${pr}`);
 if(pr==='TIMEOUT'){log('CANDIDATE_FREEZE pre-type');await p.screenshot({path:EV+`/CAND-c${i}.png`,timeout:5000}).catch(()=>{});process.exit(2);}
 if(i===1){await p.getByPlaceholder('Subject').first().fill('G2 test c'+Date.now());}
 await p.mouse.click(940,540);
 await p.keyboard.type(i%2?'Dear Andreas,':'Meine Lieben,',{delay:40});
 log(`c${i} Enter#1 PENDING`);
 await p.keyboard.press('Enter');
 await p.keyboard.type('text line '+i,{delay:30});
 await p.keyboard.press('Enter');
 const t2=Date.now();
 const pr2=await Promise.race([p.evaluate(()=>document.querySelectorAll('*').length),sleep(10000).then(()=>'TIMEOUT')]);
 log(`c${i} Enter done; probe=${Date.now()-t2}ms dom=${pr2}`);
 if(pr2==='TIMEOUT'){log('CANDIDATE_FREEZE after Enter');await p.screenshot({path:EV+`/CAND-c${i}.png`,timeout:5000}).catch(()=>{});process.exit(2);}
 const cnt=await p.getByText(/Recipients \(\d+\)|selected/).first().innerText().catch(()=>'?');
 const heap=await p.evaluate(()=>performance.memory&&Math.round(performance.memory.usedJSHeapSize/1e6)).catch(()=>null);
 log(`c${i} recips='${cnt.replace(/\n/g,' ')}' heapMB=${heap}`);
 await p.screenshot({path:EV+`/g2-c${i}.png`});
 await b.close();   // disconnect Playwright
 // real hidden
 log(`c${i} PENDING hidden ${HID}s`);
 await req('PUT','/json/new?about:blank');
 await sleep(HID*1000);
 await req('GET','/json/activate/'+tid);
 await sleep(1500);
 ({b,p}=await conn());
 const pg=b.contexts()[0].pages().find(x=>/scotty/.test(x.url()));
 const vis=await pg.evaluate(()=>JSON.stringify(window.__vis.slice(-2)+'|'+document.visibilityState));
 log(`c${i} DONE hidden; vis=${vis}`);
 // close extra blank tab(s)
 for(const t of JSON.parse(await req('GET','/json')).filter(t=>t.type==='page'&&t.url==='about:blank')) await req('GET','/json/close/'+t.id);
 await b.close();
 await sleep(i%3===0?60000:5000);
}
log('CYCLES complete elapsedMin='+Math.round((Date.now()-t0)/60000));
})().catch(e=>{log('DRIVER_ERR '+e.message.slice(0,200));process.exit(1)});
