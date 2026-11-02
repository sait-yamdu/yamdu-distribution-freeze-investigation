const L=require('./lib');(async()=>{const {c}=await L.conn();for(const q of c.pages())if(q.url()==='about:blank')await q.close();process.exit(0)})()
