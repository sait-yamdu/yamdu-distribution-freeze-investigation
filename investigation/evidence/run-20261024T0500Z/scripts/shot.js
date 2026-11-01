const {conn,EV,sleep}=require('./lib.js');
(async()=>{const {p}=await conn();console.log(p.url());await p.screenshot({path:EV+'/11-state.png'});console.log(await p.locator('button:visible').allInnerTexts());process.exit(0)})();
