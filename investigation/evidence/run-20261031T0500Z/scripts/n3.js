const {conn,log,EV}=require('./lib');
(async()=>{const {b,p}=await conn();p.setDefaultTimeout(8000);
await p.mouse.click(487,178);await p.waitForTimeout(800);
await p.screenshot({path:EV+'/n3a.png',clip:{x:60,y:140,width:480,height:200}});
process.exit(0);})().catch(e=>{console.log('ERR',e.message.slice(0,300));process.exit(1)});
