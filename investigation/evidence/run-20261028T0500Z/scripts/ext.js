const {conn,log,EV,sleep,probe}=require('./lib.js');
(async()=>{const {p}=await conn();
 const bx=p.locator('input[type=checkbox][aria-label=Select]').nth(1);
 await bx.scrollIntoViewIfNeeded(); const bb=await bx.boundingBox(); console.log(JSON.stringify(bb));
 await p.mouse.click(bb.x+10,bb.y+10); await sleep(1000);
 console.log('checked',await bx.isChecked(),'tab', await p.getByText(/^Recipients \(/).first().innerText());
 await p.screenshot({path:EV+'/ext2.png'}); process.exit(0);})().catch(e=>{console.log('ERR',e.message.slice(0,200));process.exit(1)});
