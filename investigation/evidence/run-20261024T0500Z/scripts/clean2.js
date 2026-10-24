const {conn,sleep,log,EV}=require('./lib.js');
(async()=>{const {p}=await conn();
 for(let i=0;i<5;i++){const d=p.getByRole('button',{name:'Discard changes'});if(await d.count()){await d.click().catch(()=>{});await sleep(1000);continue}
  const x=p.getByRole('button',{name:'Cancel',exact:true});if(await x.count()){await x.last().click().catch(()=>{});await sleep(1000)}}
 await p.screenshot({path:EV+'/12-clean.png'});
 log({ev:'done',name:'clean2',url:p.url(),pm:await p.locator('.ProseMirror').count(),sideLinks:await p.locator('a:visible').allInnerTexts().then(a=>a.filter(Boolean).slice(0,15))});process.exit(0)})();
