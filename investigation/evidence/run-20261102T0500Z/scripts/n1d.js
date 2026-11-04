const L=require('./lib');
(async()=>{const {p}=await L.conn();
L.log('N1 step4 PENDING rename contact + Save');
const n=p.locator('input').filter({hasText:''}).nth(0);
await p.mouse.click(700,383);await p.keyboard.press('End');await p.keyboard.type(' EDIT-1102',{delay:30});
await p.mouse.click(1272,696);await p.waitForTimeout(4000);await p.screenshot({path:L.EV+'/05-saved.png'});
L.log('N1 step4 DONE url '+p.url());process.exit(0)})().catch(e=>{console.log('ERR',e.message);process.exit(1)});
