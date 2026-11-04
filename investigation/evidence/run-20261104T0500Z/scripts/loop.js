const L=require('./lib');const {execSync}=require('child_process');
const END=Date.now()+(+process.argv[2]||22)*60000;
const probe=async(p,tag)=>{const t0=Date.now();const r=await Promise.race([p.evaluate(()=>[document.visibilityState,document.querySelectorAll('*').length,Math.round(performance.memory.usedJSHeapSize/1e6)]),new Promise(r=>setTimeout(()=>r('TIMEOUT'),8000))]);L.log(tag+' probe '+(Date.now()-t0)+'ms '+JSON.stringify(r));return r};
const closeAll=async p=>{await p.evaluate(()=>{document.querySelectorAll("*").forEach(e=>{if(e.scrollTop>0)e.scrollTop=0})});await p.waitForTimeout(600);await p.mouse.click(1288,36);await p.waitForTimeout(1200);await p.mouse.click(891,224);await p.waitForTimeout(1500)};
const enter=async(p,tag)=>{L.log(tag+' ENTER PENDING');const t=Date.now();await p.mouse.click(900,600);await p.keyboard.press('Control+End');for(const w of ['Dear Andreas,','Meine Lieben,']){await p.keyboard.type(w,{delay:40});await p.keyboard.press('Enter')}L.log(tag+' ENTER DONE '+(Date.now()-t)+'ms');await probe(p,tag)};
(async()=>{const {p}=await L.conn();let i=0;
while(Date.now()<END){i++;L.log('CYCLE '+i+' PENDING');
 try{
 // A: drafts -> reopen -> Enter -> hidden 45s -> Enter -> discard
 await p.mouse.click(96,378);await p.waitForTimeout(3500);
 await p.getByText('Draft (',{exact:false}).first().click({timeout:8000});await p.waitForTimeout(2500);
 await p.mouse.click(390,433);await p.waitForTimeout(4500);
 await enter(p,'c'+i+'A1');
 execSync('node hide.js 45',{env:{...process.env,EVD:L.EV},timeout:90000});await p.waitForTimeout(1500);
 L.log('c'+i+' vis='+await p.evaluate(()=>window.__vis.length));
 await enter(p,'c'+i+'A2');
 await closeAll(p);
 // B: Files -> doc -> select 3 -> share -> search + Enter
 await p.mouse.click(75,336);await p.waitForTimeout(3500);
 await p.mouse.click(795,590);await p.waitForTimeout(3000);await p.mouse.click(385,400);await p.waitForTimeout(3500);
 await p.getByText('Select multiple').first().click({timeout:8000});await p.waitForTimeout(1000);
 for(const [x,y] of [[770,375],[1022,375],[770,625]]){await p.mouse.click(x,y);await p.waitForTimeout(500)}
 await p.getByText('Share files',{exact:true}).first().click({timeout:8000});await p.waitForTimeout(3500);
 await p.mouse.click(150,168);await p.keyboard.type('Moritz',{delay:50});await p.waitForTimeout(1500);await p.mouse.click(256,293).catch(()=>{});
 await enter(p,'c'+i+'B1');
 await closeAll(p);
 // C: crew external contacts + crew list
 await p.mouse.click(75,252);await p.waitForTimeout(3500);
 await p.getByText('External contacts').first().click({timeout:8000});await p.waitForTimeout(2500);
 await p.getByText('Crew list').first().click({timeout:8000});await p.waitForTimeout(2500);
 L.log('CYCLE '+i+' DONE');
 }catch(e){L.log('CYCLE '+i+' ERR '+e.message.slice(0,120));await p.screenshot({path:L.EV+'/err-c'+i+'.png'}).catch(()=>{});
  await p.keyboard.press('Escape').catch(()=>{});await closeAll(p).catch(()=>{});}
}
L.log('LOOP END cycles='+i);process.exit(0)})();
