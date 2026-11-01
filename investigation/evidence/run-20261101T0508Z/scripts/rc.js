const L=require('./lib');(async()=>{const {p}=await L.conn();
await p.mouse.click(126,112);await p.waitForTimeout(1000);await p.mouse.click(270,169);await p.keyboard.type('Moritz',{delay:60});await p.waitForTimeout(2000);
await p.screenshot({path:L.EV+'/rc1.png'});process.exit(0)})()
