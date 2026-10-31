const {conn,log,EV}=require('./lib');
(async()=>{const {b,p}=await conn();
await p.evaluate(()=>{window.__vis=[];document.addEventListener('visibilitychange',()=>window.__vis.push([Date.now(),document.visibilityState]));});
await p.getByText('Files & Documents',{exact:true}).first().click();await p.waitForTimeout(4000);
log('docs url='+p.url());await p.screenshot({path:EV+'/04-docs.png'});await b.close();})();
