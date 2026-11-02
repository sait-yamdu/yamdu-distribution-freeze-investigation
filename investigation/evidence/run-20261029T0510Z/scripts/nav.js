const {conn,log,EV,sleep}=require('./lib.js');
(async()=>{const {p}=await conn();
 await p.goto('https://scotty.yamdu.com/#5551/announcements:files:filedistribution'); await sleep(6000);
 log({a:'nav-project',url:p.url()}); await p.screenshot({path:EV+'/03-project.png'}); process.exit(0);})();
