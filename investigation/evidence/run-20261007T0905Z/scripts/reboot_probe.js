const {chromium}=require('playwright');
(async()=>{
 const b=await chromium.connectOverCDP('http://localhost:9222'); const p=b.contexts()[0].pages()[0];
 let nav=0; p.on('framenavigated',f=>{if(f===p.mainFrame())nav++});
 const reqs=[]; p.on('request',r=>{if(r.resourceType()==='script'||r.resourceType()==='document')reqs.push(r.resourceType()+' '+r.url().slice(0,110))});
 const snap=()=>p.evaluate(()=>({marker:window.__mk||null,scripts:document.scripts.length,bodyKids:document.body.children.length,jq:!!window.jQuery}));
 await p.evaluate(()=>{window.__mk='same-document'});
 console.log('before',JSON.stringify(await snap()));
 for(const [h,l] of [['#5551/documents','valid Files & Documents'],['#5551/files','invalid files'],['#5551/breakdowns:scenes','valid Scenes'],['#5551/scenes','invalid scenes']]){
   reqs.length=0; nav=0; await p.evaluate(h=>{location.hash=h},h); await p.waitForTimeout(6000);
   console.log('==',l,h,'url',p.url(),'framenavigated',nav,JSON.stringify(await snap())); console.log('  script/doc requests:',reqs.length, JSON.stringify(reqs.slice(0,6)));
   await p.evaluate(()=>{location.hash='#5551/announcements:files:filedistribution'}); await p.waitForTimeout(3000);
 }
 process.exit(0);
})();
