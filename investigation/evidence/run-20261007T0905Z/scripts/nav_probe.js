const {chromium}=require('playwright');
(async()=>{
 const b=await chromium.connectOverCDP('http://localhost:9222'); const p=b.contexts()[0].pages()[0];
 const net=[]; p.on('response',r=>{if(r.status()>=400)net.push(r.status()+' '+r.url().slice(0,140))});
 const con=[]; p.on('console',m=>{if(['error','warning'].includes(m.type()))con.push(m.type()+': '+m.text().slice(0,160))});
 const loaders=()=>p.evaluate(()=>[...document.querySelectorAll('[class*=load i],[class*=spinner i],[class*=Loader],[class*=skeleton i]')].filter(e=>e.offsetParent&&e.getBoundingClientRect().width>0).map(e=>e.className.toString().slice(0,60)).slice(0,8));
 for(const h of ['files','scenes']){ net.length=0;con.length=0;
   await p.evaluate(h=>{location.hash='#5551/'+h},h); await p.waitForTimeout(6000);
   console.log('== OLD hash nav',h,'url',p.url()); console.log('net>=400',JSON.stringify(net)); console.log('console',JSON.stringify(con.slice(0,5))); console.log('visible loaders',JSON.stringify(await loaders()));
   await p.screenshot({path:'/tmp/w/oldnav-'+h+'.png'});
 }
 // real sidebar links
 console.log(JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('a[href*="#"]')].filter(a=>a.offsetParent).map(a=>a.innerText.trim().split('\n')[0]+' -> '+a.getAttribute('href')).filter(s=>/Files|Scenes|Distribution|Crew/.test(s)))));
 process.exit(0);
})();
