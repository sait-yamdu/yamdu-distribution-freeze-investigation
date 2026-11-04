const {conn,log,EV,sleep}=require('./lib.js');
(async()=>{
 const {b,p}=await conn();
 await p.getByText('Store as mailing list').first().click(); await sleep(2000);
 await p.screenshot({path:EV+'/x3-store-ml.png'});
 console.log(await p.evaluate(()=>[...document.querySelectorAll('input,button')].filter(b=>b.offsetParent).slice(-14).map(b=>(b.tagName+':'+(b.innerText||b.placeholder||b.ariaLabel||'')).trim())));
 process.exit(0);
})().catch(e=>{console.log(e.message.slice(0,300));process.exit(1)});
