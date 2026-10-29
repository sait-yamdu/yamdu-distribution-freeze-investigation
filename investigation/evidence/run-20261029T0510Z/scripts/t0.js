const {conn,log,sleep}=require('./lib.js');
(async()=>{const {p}=await conn(); try{await p.goto('https://scotty.yamdu.com/Account/Login',{waitUntil:'domcontentloaded',timeout:30000});console.log('OK',p.url(),await p.title());}catch(e){console.log('ERR',e.message.slice(0,150))} process.exit(0)})();
