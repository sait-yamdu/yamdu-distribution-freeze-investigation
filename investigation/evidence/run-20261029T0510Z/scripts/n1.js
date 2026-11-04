const {conn,log,EV,sleep,probe}=require('./lib.js');
(async()=>{const {p}=await conn();
 log({a:'nav to known valid doc route (id=57452/70813, from prior runs)',pending:true});
 await p.evaluate(()=>{location.hash='#5551/documents/documentcategoryprofile!id=57452/documentprofile!id=70813'}); await sleep(6000);
 log({a:'nav doc',done:true,url:p.url()}); await probe(p,'doc'); await p.screenshot({path:EV+'/06-doc.png'});
 console.log(await p.locator('body').innerText().then(t=>t.slice(0,600).replace(/\n/g,' | ')));
 process.exit(0);})().catch(e=>{log({fatal:e.message.slice(0,300)});process.exit(1)});
