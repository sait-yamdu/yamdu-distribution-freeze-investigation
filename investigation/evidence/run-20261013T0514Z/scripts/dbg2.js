const {conn,EV,sleep}=require('./lib.js');(async()=>{const {p}=await conn();
 await p.getByText('Distribution',{exact:true}).first().click().catch(()=>{});
 process.exit(0)})()
