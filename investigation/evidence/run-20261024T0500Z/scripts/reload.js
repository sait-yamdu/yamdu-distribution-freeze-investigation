const {conn,sleep,log}=require('./lib.js');
(async()=>{const {p}=await conn();await p.reload({waitUntil:'domcontentloaded'});await sleep(7000);log({ev:'done',name:'reload',url:p.url(),scripts:await p.evaluate(()=>document.scripts.length)});process.exit(0)})();
