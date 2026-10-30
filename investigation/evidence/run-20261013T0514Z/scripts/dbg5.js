const {conn,EV,sleep}=require('./lib.js');(async()=>{const {p}=await conn();
 const dlg=p.locator('.modal_with_action_buttons_content:has-text("Choose when")').last();
 const di=dlg.locator('input.mantine-DateInput-input'), ti=dlg.locator('input.mantine-Autocomplete-input');
 await di.click({timeout:5000}); await p.keyboard.press('Control+A'); await p.keyboard.type('11/01/2027',{delay:60}); await p.keyboard.press('Enter'); await sleep(500);
 await ti.click({timeout:5000}); await p.keyboard.press('Control+A'); await p.keyboard.type('09:15',{delay:60}); await p.keyboard.press('Enter'); await sleep(500);
 await di.click(); await sleep(600); await p.screenshot({path:EV+'/x11.png'}); await p.keyboard.press('Escape'); await sleep(400);
 console.log(await di.inputValue(), await ti.inputValue(), await p.getByText('Choose when this distribution').count());
 process.exit(0)})()
