const {conn,EV,sleep}=require('./lib.js');(async()=>{const {p}=await conn();
await require('./closeall_fn.js')(p); await p.locator('a:visible',{hasText:'Distribution'}).first().click(); await sleep(2500);
 await p.getByText(/^Draft/).first().click(); await sleep(2500); await p.locator('tr:has-text("M1 explore")').first().click(); await sleep(3500);
 await p.getByRole('button',{name:/^Check recipients/}).click(); await sleep(2500);
 await p.evaluate(()=>{const bs=[...document.querySelectorAll('button')].filter(b=>b.offsetParent&&/^\s*Next\s*$/.test(b.innerText||'')).sort((a,b)=>b.getBoundingClientRect().y-a.getBoundingClientRect().y); bs[0].click();}); await sleep(3000);
 await p.mouse.click(1299,716); await sleep(900); await p.getByText('Send at a scheduled time').click(); await sleep(1200);
 const dlg=p.locator('.modal_with_action_buttons_content:has-text("Choose when")').last();
 const di=dlg.locator('input.mantine-DateInput-input'), ti=dlg.locator('input.mantine-Autocomplete-input');
 await ti.click(); await p.keyboard.press('Control+A'); await p.keyboard.type('23:45',{delay:60}); await sleep(600); await p.screenshot({path:EV+'/x16.png'}); await p.keyboard.press('Tab'); await sleep(500);
 console.log(await di.inputValue(), await ti.inputValue(), await p.getByText('Choose when this distribution').count());
 await di.click(); await sleep(800); await p.screenshot({path:EV+'/x17.png'});
 process.exit(0)})()
