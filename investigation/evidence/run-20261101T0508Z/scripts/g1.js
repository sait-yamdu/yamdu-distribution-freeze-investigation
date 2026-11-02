const L=require('./lib');
(async()=>{const {p}=await L.conn();
L.log('PENDING tick contact checkbox');
await p.mouse.click(271,303);await p.waitForTimeout(1000);
await p.mouse.click(296,178);await p.waitForTimeout(1500); // clear search
await p.getByText(/^Recipients \(\d+\)/).first().click();await p.waitForTimeout(1000);
await p.screenshot({path:L.EV+'/17-recip.png'});
L.log('recips tab: '+await p.evaluate(()=>[...document.querySelectorAll('*')].map(e=>e.children.length==0&&/^Recipients \(\d+\)$/.test(e.textContent.trim())?e.textContent.trim():null).filter(Boolean).join(',')));
L.log('PENDING subject + editor typing');
await p.mouse.click(940,318);await p.keyboard.type('FRZ ext contact share test',{delay:40});
await p.mouse.click(940,520);await p.keyboard.type('Dear Andreas,',{delay:60});await p.keyboard.press('Enter');await p.keyboard.type('Test text',{delay:60});await p.keyboard.press('Enter');
await p.waitForTimeout(1000);await p.screenshot({path:L.EV+'/18-typed.png'});
L.log('COMPLETED typed + 2 Enter');
process.exit(0)})().catch(e=>{console.log('ERR',e.message);process.exit(1)});
